package datart.server.config;

import datart.core.base.consts.TenantManagementMode;
import datart.core.base.exception.Exceptions;
import datart.core.common.Application;
import datart.core.entity.Organization;
import datart.core.entity.Role;
import datart.core.entity.User;
import datart.security.base.RoleType;
import datart.security.manager.DatartSecurityManager;
import datart.server.base.params.OrgCreateParam;
import datart.server.service.OrgService;
import datart.server.service.RoleService;
import datart.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
public class AppModeStartConfig implements ApplicationListener<ApplicationStartedEvent> {

    protected DatartSecurityManager securityManager;

    private final UserService userService;

    private final RoleService roleService;

    private final OrgService orgService;

    public AppModeStartConfig(UserService userService, RoleService roleService, OrgService orgService) {
        this.userService = userService;
        this.roleService = roleService;
        this.orgService = orgService;
    }

    @Autowired
    public void setSecurityManager(DatartSecurityManager datartSecurityManager) {
        this.securityManager = datartSecurityManager;
    }

    @Override
    @Transactional
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        TenantManagementMode currMode = Application.getCurrMode();
        if (TenantManagementMode.TEAM.equals(currMode)) {
            String adminId = Application.getAdminId();
            String username = Application.getProperty("datart.admin.username");
            String password = Application.getProperty("datart.admin.password");

            User adminUser = initAdminUser(adminId, username, password);
            securityManager.runAs(username);
            Organization org = initOrganization(adminUser);

            log.info("The application is running in {} tenant-management-mode, and the admin username is {}.", currMode, username);
        } else {
            log.info("The application is running in {} tenant-management-mode.", currMode);
        }
    }

    private User initAdminUser(String adminId, String username, String password) {
        User adminUser = userService.getDefaultMapper().selectByPrimaryKey(adminId);
        if (adminUser==null) {
            if (StringUtils.isAnyBlank(username, password)){
                Exceptions.msg("The admin username/password need to be set, Please check the config.");
            }
            adminUser = new User();
            adminUser.setId(adminId);
            adminUser.setUsername(username);
            adminUser.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
            String str = username+LocalDate.now();
            adminUser.setEmail(DigestUtils.md5Hex(str)+"@datart.generate");
            adminUser.setActive(true);
            adminUser.setCreateBy(adminId);
            adminUser.setCreateTime(new Date());
            userService.getDefaultMapper().insert(adminUser);
        } else if (StringUtils.isNoneBlank(username, password)){
            adminUser.setUsername(username);
            adminUser.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
            adminUser.setActive(true);
            userService.getDefaultMapper().updateByPrimaryKeySelective(adminUser);
        }
        return userService.getDefaultMapper().selectByPrimaryKey(adminId);
    }

    private Organization initOrganization(User adminUser) {
        Organization organization = null;
        List<Organization> organizations = orgService.getDefaultMapper().list();
        if (organizations.size() == 0) {
            OrgCreateParam orgCreateParam = new OrgCreateParam();
            orgCreateParam.setName(adminUser.getUsername()+"'s Organization");
            organization = orgService.createOrganization(orgCreateParam);
        } else if (organizations.size() == 1) {
            organization = organizations.get(0);
            organization.setCreateBy(adminUser.getId());
            orgService.getDefaultMapper().updateByPrimaryKeySelective(organization);
            Role role = roleService.getDefaultMapper().selectOrgOwnerRole(organization.getId());
            if (role == null) {
                orgService.createDefaultRole(RoleType.ORG_OWNER, adminUser, organization);
            }
            roleService.grantOrgOwner(organization.getId(), adminUser.getId(), false);
        } else {
            Exceptions.base("There is more than one organization in team tenant-management-mode, please initialize database or switch to platform tenant-management-mode.");
        }
        return organization;
    }

}
