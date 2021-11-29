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

package datart.server.config.interceptor;

import datart.core.base.annotations.SkipLogin;
import datart.core.base.consts.Const;
import datart.core.base.exception.Exceptions;
import datart.core.common.MessageResolver;
import datart.security.exception.AuthException;
import datart.security.manager.DatartSecurityManager;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Component
public class LoginInterceptor implements HandlerInterceptor {

    private final DatartSecurityManager securityManager;

    private final MessageResolver messageResolver;

    public LoginInterceptor(DatartSecurityManager securityManager, MessageResolver messageResolver) {
        this.securityManager = securityManager;
        this.messageResolver = messageResolver;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        if (handlerMethod.getMethodAnnotation(SkipLogin.class) != null) {
            return true;
        }
        String token = request.getHeader(Const.TOKEN);
        if (token == null) {
            Exceptions.tr(AuthException.class,"login.not-login");
        }
        token = securityManager.login(token);
        response.setHeader(Const.TOKEN, token);
        return securityManager.isAuthenticated();
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        securityManager.logoutCurrent();
    }
}