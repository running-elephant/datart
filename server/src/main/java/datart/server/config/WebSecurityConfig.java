package datart.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import static datart.core.common.Application.getApiPrefix;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private OAuth2ClientProperties oAuth2ClientProperties;

    private Oauth2AuthenticationSuccessHandler authenticationSuccessHandler;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(getApiPrefix() + "/tpa");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.headers().frameOptions().disable();
        if (this.oAuth2ClientProperties != null) {
            http.oauth2Login().successHandler(authenticationSuccessHandler);
            http
                    .authorizeRequests()
                    .antMatchers(getApiPrefix() + "/tpa").permitAll()
                    .and().oauth2Login().loginPage("/")
                    .and().logout().logoutUrl("/tpa/oauth2/logout").permitAll();
        }

    }

    @Autowired(required = false)
    public void setoAuth2ClientProperties(OAuth2ClientProperties properties) {
        this.oAuth2ClientProperties = properties;
    }

    @Autowired
    public void setAuthenticationSuccessHandler(Oauth2AuthenticationSuccessHandler authenticationSuccessHandler) {
        this.authenticationSuccessHandler = authenticationSuccessHandler;
    }
}
