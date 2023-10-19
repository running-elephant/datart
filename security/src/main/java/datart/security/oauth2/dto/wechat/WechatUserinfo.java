package datart.security.oauth2.dto.wechat;

import lombok.Data;

import java.util.List;

@Data
public class WechatUserinfo {

    private String openid;

    private String nickname;

    private Integer sex;

    private String province;

    private String city;

    private String country;

    private String headimgurl;

    private List<String> privilege;

    private String unionid;

}
