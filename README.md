## 1 环境准备

- JDK 1.8+
- MySql5.7+
- datart安装包（datart-server-1.0.0-alpha.0-install
- Mail Server （可选）
- [ChromeWebDriver](https://chromedriver.chromium.org/) （可选）
- Redis （可选）

- 解压安装包
```bash
unzip datart-server-1.0.0-alpha.0-install
```

## 2 初始化数据库

- 创建数据库，并将bin/datart.sql导入到数据库中

```bash
mysql> create database datart;
mysql> use datart;
mysql> source bin/datart.sql
```

## 3 修改配置文件

- 配置文件位于 config/application-config.yml.example，先重命名为application-config.yml，需要配置的项为: 数据库连接信息，邮件配置，浏览器截图驱动

### 3.1 数据库连接信息

***注：请务必保留连接串中的`allowMultiQueries=true`参数***

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://{IP:PORT}/datart?&allowMultiQueries=true
    username: { USERNAME }
    password: { PASSWORD }
```

### 3.2 服务端属性配置

- Web服务绑定IP和端口

```yaml
server:
  port: { PORT }
  address: { IP }
```

- 配置服务端访问地址，创建分享，激活/邀请用户时，将使用这个地址作为服务端访问地址。

```yaml
datart:
  server:
    address: http://{IP/域名}:{端口}

```

- 其它可选配置项

```yaml
datart:
  user:
    active:
      send-mail: true  # 注册用户时是否需要邮件验证激活

  security:
    token:
      secret: "sHAS$as@fsdkKjd" #加密密钥
      timeout-min: 30  # 登录会话有效时长，单位：分钟。

  env:
    file-path: ${user.dir}/files # 服务端文件保存位置 

```

*注意：加密密钥每个服务端部署前应该进行修改，且部署后不能再次修改。如果是集群部署，同一个集群内的secret要保持统一*

### 3.3 邮件服务配置 (可选)

***邮件服务用于定时任务发送，用户注册/激活/邀请等功能。要体验完整的datart功能，请务必正确的邮件服务***

- 以下为完整配置

```yaml
spring:
  mail:
    host: { 邮箱服务地址 }
    port: { 端口号 }
    username: { 邮箱地址 }
    fromAddress:
    password: { 邮箱服务密码 }
    senderName: { 发送者昵称 }

    properties:
      smtp:
        starttls:
          enable: true
          required: true
        auth: true
      mail:
        smtp:
          ssl:
            enable: true
```

***配置说明***

- `username`为邮箱地址，`password`邮箱服务密码，需要注意的是常见免费邮箱（如 163 邮箱、QQ 邮箱、gmail 等）这里应填客户端独立密码，可前往对应邮箱账号设置页面开启 SMTP
  服务，并申请客户端授权码（或独立密码，各邮箱提供商叫法不同）

下表为常见免费邮箱 SMTP 服务地址及端口：
![img_1.png](https://edp963.github.io/davinci/assets/images/deployment/2.4.3.1.png)

### 3.4截图配置 (可选)

- 截图配置用于定时任务中的发送图片功能。

```yaml
datart:
  screenshot:
    timeout-seconds: 60
    webdriver-type: CHROME
    webdriver-path: {Web Driver Path}
```

- 配置说明
  `timeout-seconds` 指定截图超时时间
  `webdriver-type` 截图浏览器类型。(目前仅支持`CHROME`)
  `webdriver-path` webdriver地址。可执行文件的绝对地址，或远程webdriver的调用地址

*

注意：配置时请确保浏览器的版本和webdriver的版本匹配。推荐使用docker镜像 [selenium/standalone-chrome](https://registry.hub.docker.com/r/selenium/standalone-chrome)
来配置远程截图服务。*

```
docker run -p 4444:4444 -d --name selenium-chrome --shm-size="2g" selenium/standalone-chrome
```

- 然后配置 `webdriver-path: "http://{IP}:4444/wd/hub"`
