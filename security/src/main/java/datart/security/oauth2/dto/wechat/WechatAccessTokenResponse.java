package datart.security.oauth2.dto.wechat;

import lombok.Data;

@Data
public class WechatAccessTokenResponse {

    private String access_token;

    private Integer expires_in;

    private String refresh_token;

    private String openid;

    private String scope;

}
