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

import com.alibaba.fastjson.JSONObject;
import com.jayway.jsonpath.JsonPath;
import datart.core.entity.User;
import datart.core.mappers.ext.UserMapperExt;
import datart.security.base.PasswordToken;
import datart.security.util.JwtUtils;
import datart.server.base.params.UserRegisterParam;
import datart.server.service.ExternalRegisterService;
import datart.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.LdapQueryBuilder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

import static datart.core.common.Application.getProperty;

@Slf4j
@Service
public class ExternalRegisterServiceImpl implements ExternalRegisterService {

    private LdapTemplate ldapTemplate;

    private final UserService userService;

    private final UserMapperExt userMapper;

    public ExternalRegisterServiceImpl(UserService userService,
                                       UserMapperExt userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @Autowired(required = false)
    private void setLdapTemplate(LdapTemplate template) {
        ldapTemplate = template;
    }

    @Override
    public String ldapRegister(String filter, String password) throws MessagingException, UnsupportedEncodingException {
        try {
            ldapTemplate.authenticate(LdapQueryBuilder.query().filter(String.format("(|(uid=%s)(cn=%s))", filter, filter)), password);
        } catch (Exception e) {
            return null;
        }
        String email = null;

        try {
            email = ldapTemplate.searchForContext(LdapQueryBuilder.query().where("uid").is(filter).or("cn").is(filter))
                    .getAttributes().get("mail").get().toString();
        } catch (Exception ignored) {
        }

        UserRegisterParam registerParam = new UserRegisterParam();
        registerParam.setUsername(filter);
        registerParam.setPassword(password);
        registerParam.setEmail(email);

        if (userService.register(registerParam, false)) {
            PasswordToken passwordToken = new PasswordToken(registerParam.getUsername(),
                    null,
                    System.currentTimeMillis());

            passwordToken.setPassword(registerParam.getPassword());
            return JwtUtils.toJwtString(passwordToken);
        }
        return null;
    }

    @Override
    public String oauth2Register(OAuth2AuthenticationToken oauthAuthToken) throws MessagingException, UnsupportedEncodingException {
        OAuth2User oauthUser = oauthAuthToken.getPrincipal();

        User user = userMapper.selectByNameOrEmail(oauthUser.getName());
        if (user != null) {
            PasswordToken passwordToken = new PasswordToken(user.getUsername(),
                    null,
                    System.currentTimeMillis());
            return JwtUtils.toJwtString(passwordToken);
        }

        String emailMapping = getProperty(String.format("spring.security.oauth2.client.provider.%s.userMapping.email", oauthAuthToken.getAuthorizedClientRegistrationId()));
        JSONObject jsonObj = new JSONObject(oauthUser.getAttributes());

        UserRegisterParam userRegisterParam = new UserRegisterParam();
        userRegisterParam.setUsername(oauthUser.getName());
        userRegisterParam.setPassword(oauthUser.getName());
        if (emailMapping != null) {
            userRegisterParam.setEmail(JsonPath.read(jsonObj, emailMapping));
        }
        if (userService.register(userRegisterParam, false)) {
            PasswordToken passwordToken = new PasswordToken(userRegisterParam.getUsername(),
                    null,
                    System.currentTimeMillis());

            passwordToken.setPassword(userRegisterParam.getPassword());
            return JwtUtils.toJwtString(passwordToken);
        }
        return null;

    }
}
