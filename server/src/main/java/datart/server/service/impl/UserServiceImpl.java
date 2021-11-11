/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package datart.server.service.impl;

import datart.core.base.consts.UserIdentityType;
import datart.core.common.UUIDGenerator;
import datart.core.entity.Organization;
import datart.core.entity.User;
import datart.core.entity.ext.UserBaseInfo;
import datart.core.mappers.ext.OrganizationMapperExt;
import datart.core.mappers.ext.UserMapperExt;
import datart.security.base.PasswordToken;
import datart.security.util.JwtUtils;
import datart.security.util.SecurityUtils;
import datart.server.base.dto.OrganizationBaseInfo;
import datart.server.base.dto.UserProfile;
import datart.server.base.exception.NotFoundException;
import datart.server.base.exception.ParamException;
import datart.server.base.exception.ServerException;
import datart.server.base.params.ChangeUserPasswordParam;
import datart.server.base.params.UserRegisterParam;
import datart.server.base.params.UserResetPasswordParam;
import datart.server.service.BaseService;
import datart.server.service.MailService;
import datart.server.service.OrgService;
import datart.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl extends BaseService implements UserService {

    private final UserMapperExt userMapper;

    private final OrganizationMapperExt orgMapper;

    private final OrgService orgService;

    private final MailService mailService;

    @Value("${datart.user.active.send-mail:true}")
    private boolean sendEmail;

    public UserServiceImpl(UserMapperExt userMapper,
                           OrganizationMapperExt orgMapper,
                           OrgService orgService,
                           MailService mailService) {
        this.userMapper = userMapper;
        this.orgMapper = orgMapper;
        this.orgService = orgService;
        this.mailService = mailService;
    }

    @Override
    public UserProfile getUserProfile() {
        User user = userMapper.selectByPrimaryKey(getCurrentUser().getId());
        UserProfile userProfile = new UserProfile(user);
        List<OrganizationBaseInfo> organizationBaseInfos = orgService.listOrganizations();
        userProfile.setOrganizations(organizationBaseInfos);
        return userProfile;
    }

    @Override
    public List<UserBaseInfo> listUsersByKeyword(String keyword) {
        keyword = StringUtils.appendIfMissing(keyword, "%");
        keyword = StringUtils.prependIfMissing(keyword, "%");
        List<User> users = userMapper.searchUsers(keyword);
        final User self = securityManager.getCurrentUser();
        return users.stream()
                .filter(user -> !user.getId().equals(self.getId()))
                .map(UserBaseInfo::new)
                .collect(Collectors.toList());
    }

    @Override
    public User getUserByName(String username) {
        return userMapper.selectByNameOrEmail(username);
    }


    /**
     * 新用户注册
     * 1: 校验用户名和邮箱不能重复
     * 2: 根据应用程序配置，决定是否为用户发送激活邮件
     * 3: 激活用户，为用户创建默认组织和角色
     *
     * @param userRegisterParam 用户注册信息
     * @return 注册是否成功
     */
    @Override
    @Transactional
    public boolean register(UserRegisterParam userRegisterParam) throws MessagingException, UnsupportedEncodingException {
        if (!checkUserName(userRegisterParam.getUsername())) {
            log.error("The username({}) has been registered", userRegisterParam.getUsername());
            throw new ParamException(getMessages("error.param.occupied", "resource.user.username"));
        }
        if (!checkEmail(userRegisterParam.getEmail())) {
            log.info("The email({}) has been registered", userRegisterParam.getEmail());
            throw new ParamException(getMessages("error.param.occupied", "resource.user.email"));
        }
        BCrypt.hashpw(userRegisterParam.getPassword(), BCrypt.gensalt());
        User user = new User();
        BeanUtils.copyProperties(userRegisterParam, user);
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        user.setId(UUIDGenerator.generate());
        user.setCreateBy(user.getId());
        user.setCreateTime(new Date());
        user.setActive(!sendEmail);
        userMapper.insert(user);
        if (!sendEmail) {
            initUser(user);
            return true;
        }
        mailService.sendActiveMail(user);
        return true;
    }

    @Override
    @Transactional
    public String activeUser(String activeString) {
        PasswordToken passwordToken = JwtUtils.toPasswordToken(activeString);
        User user = userMapper.selectByUsername(passwordToken.getSubject());
        if (user == null) {
            throw new NotFoundException(getMessages("resource.not-exist", "resource.user"));
        }
        //更新用户激活状态至已激活
        int count = userMapper.updateToActiveById(user.getId());
        if (count != 1) {
            String msg = getMessageWithParam("message.user.active.fail", user.getUsername());
            log.warn(msg);
            throw new ServerException(msg);
        }
        initUser(user);
        log.info("User({}) activation success", user.getUsername());
        passwordToken.setPassword(null);
        passwordToken.setExp(null);
        passwordToken.setCreateTime(System.currentTimeMillis());
        return JwtUtils.toJwtString(passwordToken);
    }

    @Override
    public boolean sendActiveMail(String usernameOrEmail) throws UnsupportedEncodingException, MessagingException {
        User user = userMapper.selectByNameOrEmail(usernameOrEmail);
        if (user == null) {
            throw new NotFoundException("user " + usernameOrEmail + "not exists");
        }
        if (user.getActive()) {
            throw new ServerException("User already activated ");
        }
        mailService.sendActiveMail(user);
        return true;
    }

    @Override
    @Transactional
    public boolean changeUserPassword(ChangeUserPasswordParam passwordParam) {
        User user = securityManager.getCurrentUser();
        user = userMapper.selectByPrimaryKey(user.getId());
        if (!BCrypt.checkpw(passwordParam.getOldPassword(), user.getPassword())) {
            throw new ParamException(getMessages("error.param.invalid", "resource.user.password"));
        }
        User update = new User();
        update.setId(user.getId());
        update.setUpdateTime(new Date());
        update.setUpdateBy(user.getId());
        update.setPassword(BCrypt.hashpw(passwordParam.getNewPassword(), BCrypt.gensalt()));
        boolean success = userMapper.updateByPrimaryKeySelective(update) == 1;
        if (success) {
            log.info("User({}) password changed by {}", user.getUsername(), user.getUsername());
        }
        return success;
    }

    public boolean checkUserName(Object value) {
        return userMapper.selectByNameOrEmail(value.toString()) == null;
    }

    private boolean checkEmail(String email) {
        return userMapper.countEmail(email) == 0;
    }

    /**
     * 初始化用户:
     * 1: 创建默认组织
     * 2: 初始化组织
     *
     * @param user 需要初始化的用户
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public void initUser(User user) {
        //创建默认组织
        log.info("Create default organization for user({})", user.getUsername());
        Organization organization = new Organization();
        organization.setId(UUIDGenerator.generate());
        organization.setCreateBy(user.getId());
        organization.setCreateTime(new Date());
        organization.setName(user.getUsername() + "'s Organization");
        orgMapper.insert(organization);
        log.info("Init organization({})", organization.getName());
        orgService.initOrganization(organization, user);
    }

    @Override
    public boolean updateAvatar(String path) {
        User update = new User();
        update.setId(getCurrentUser().getId());
        update.setAvatar(path);
        return userMapper.updateByPrimaryKeySelective(update) == 1;
    }

    @Override
    public String login(PasswordToken passwordToken) {
        securityManager.login(passwordToken);
        User user = userMapper.selectByNameOrEmail(passwordToken.getSubject());
        passwordToken.setPassword(user.getPassword());
        return JwtUtils.toJwtString(passwordToken);
    }

    @Override
    public String forgetPassword(UserIdentityType type, String principal) {
        User user = null;
        switch (type) {
            case EMAIL:
                user = userMapper.selectByEmail(principal);
                break;
            case USERNAME:
                user = userMapper.selectByUsername(principal);
                break;
            default:
        }
        if (user == null) {
            throw new NotFoundException(getMessages("resource.not-exist", "resource.user"));
        }
        try {
            String verifyCode = SecurityUtils.randomPassword();
            user.setPassword(verifyCode);
            mailService.sendVerifyCode(user);
            return JwtUtils.toJwtString(new PasswordToken(user.getUsername(), verifyCode, System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Verify Code Mail send error", e);
            throw new ServerException(getMessage("message.email.send.error"));
        }
    }

    @Override
    public boolean resetPassword(UserResetPasswordParam passwordParam) {
        boolean valid = JwtUtils.validTimeout(passwordParam.getToken());
        if (!valid) {
            throw new ParamException(getMessage("message.user.verify.code.timeout"));
        }
        PasswordToken passwordToken = JwtUtils.toPasswordToken(passwordParam.getToken());
        if (!passwordToken.getPassword().equals(passwordParam.getVerifyCode())) {
            throw new ParamException(getMessage("message.user.verify.code.error"));
        }
        User user = userMapper.selectByUsername(passwordToken.getSubject());
        if (user == null) {
            throw new NotFoundException(getMessages("resource.not-exist", "resource.user"));
        }
        User update = new User();
        update.setId(user.getId());
        update.setUpdateBy(user.getId());
        update.setUpdateTime(new Date());
        update.setPassword(BCrypt.hashpw(passwordParam.getNewPassword(), BCrypt.gensalt()));
        return userMapper.updateByPrimaryKeySelective(update) == 1;
    }

    @Override
    public void requirePermission(User entity, int permission) {

    }

}
