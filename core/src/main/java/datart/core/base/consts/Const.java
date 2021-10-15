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

package datart.core.base.consts;


public class Const {

    public static final byte VIZ_PUBLISH = 2;

    public static final byte DATA_STATUS_ACTIVE = 1;

    public static final byte DATA_STATUS_ARCHIVED = 0;

    public static final byte DATA_STATUS_CREATING = 1;

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

    /**
     * 正则表达式
     */

    public static final String REG_EMAIL = "^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$";

    public static final String REG_USER_PASSWORD = ".{6,20}";

    public static final String REG_IMG = "^.+(.JPEG|.jpeg|.JPG|.jpg|.PNG|.png|.GIF|.gif)$";


    /**
     * 脚本变量
     */
    //系统变量模板，匹配系统变量的表达式。
    //public static final String REG_SYS_VAR_TEMPLATE = "[\\u4E00-\\u9FA5A-Za-z0-9._-`\"']+\\s*[!=]{1,2}\\s*[`\"'\\[]*[%s]{1}[`\"']]*";
    //匹配所有的变量
//    public static final String REG_VARIABLE_TEMPLATE = "%s[\\u4E00-\\u9FA5A-Za-z0-9._-]+%s";
    //权限变量表达式模板，匹配权限变量的整个条件表达式
//    public static final String REG_AUTH_VAR_TEMPLATE = "[\\u4E00-\\u9FA5A-Za-z0-9._-`\"']+\\s*(IN|NOT\\s+IN|IS\\s+NULL|LIKE|EXISTS|>|<|=|!)+\\s*[`\"']*(%s){1}[`\"']*";
    //查询变量正则模板，匹配查询变量及其左右的引用符、括号等
//    public static final String REG_QUERY_VAR_TEMPLATE = "[`\"'\\(]*(%s){1}[`\"'\\)]*";
    //默认的变量引用符号
    public static final String DEFAULT_VARIABLE_QUOTE = "$";

    /**
     * 权限变量
     */
    //管理员权限，拥有所有数据的权限
    public static final String ALL_PERMISSION = "@ALL_PERMISSION@";

    /**
     * Token Key
     */
    public static final String TOKEN = "Authorization";

    public static final String TOKEN_HEADER_PREFIX = "Bearer ";

    /**
     * 组织头像保存路径
     */

    public static final String PROTOCOL_HTTP_PRE = "HTTP://";

    /**
     * 权限等级定义
     */
    public static final int DISABLE = 0;

    public static final int ENABLE = 1;

    public static final int READ = 1 << 1;

    public static final int MANAGE = 1 << 2 | READ;

    public static final int GRANT = 1 << 3 | READ;

    public static final int DOWNLOAD = 1 << 5 | READ;

    public static final int SHARE = 1 << 6 | READ;

    public static final int CREATE = 1 << 7 | MANAGE;

    /*
        图片上传格式和大小
     */

    public static String DEFAULT_IMG_FORMAT = ".png";

    public static final int IMAGE_WIDTH = 256;

    public static final int IMAGE_HEIGHT = 256;


    public static final String ENCRYPT_FLAG = "_encrypted_";

}
