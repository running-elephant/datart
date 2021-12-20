---
title: 部署
---

## 0 demo

- http://datart-demo.retech.cc
- 用户名：demo
- 密码：123456

## 1 环境准备

- JDK 1.8+
- MySql5.7+
- datart安装包（datart-server-1.0.0-alpha.3-install.zip)
- Mail Server （可选）
- [ChromeWebDriver](https://chromedriver.chromium.org/) （可选）
- Redis （可选）

方式1 :解压安装包 (官方提供的包)

```bash
unzip datart-server-1.0.0-alpha.3-install.zip
```

方式2 :自行编译

```bash
git clone https://github.com/running-elephant/datart.git

cd datart

mvn clean package -Dmaven.test.skip=true

cp ./datart-server-1.0.0-alpha.3-install.zip  ${deployment_basedir}

cd ${deployment_basedir}

unzip datart-server-1.0.0-alpha.3-install.zip 

```

## 2 初始化数据库

- 创建数据库，并将bin/datart.sql导入到数据库中

```bash
mysql> CREATE DATABASE `datart` CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
mysql> use datart;
mysql> source bin/datart.sql
```

## 3 修改配置文件

- 配置文件位于 config/application-config.yml.example，先重命名为application-config.yml
```bash
   mv ${DATART_HOME}/config/application-config.yml.example  ${DATART_HOME}/config/application-config.yml
   
   需要修改的配置项:
      1. 数据库连接信息(必须)
      2. 邮件配置(注册需邮箱激活时必须)
      3. 浏览器截图驱动(可选-需要使用定时任务邮件发送图表截图时可配置)
      4. Redis(可选-需要使用缓存时可配置)
    具体配置见下述:
   
```


### 3.1 配置文件信息

***注：请务必保留连接串中的`allowMultiQueries=true`参数***

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/datart?&allowMultiQueries=true
    username: datart
    password: datart123

  # mail config  is a aliyum email example 
  mail:
    host: smtp.mxhichina.com
    port: 465
    username: aliyun.djkjfhdjfhjd@aliyun.cn
    fromAddress: aliyun.djkjfhdjfhjd@aliyun.cn
    password: hdjksadsdjskdjsnd
    senderName: aliyun

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
            trust: smtp.mxhichina.com

# redis config 如需开启缓存 需要配置
#  redis:
#    port: 6379
#    host: { HOST }

# 服务端配置 Web服务绑定IP和端口 使用 本机ip + 指定端口
server:
  port: youport
  address: youip


  compression:
    enabled: true
    mime-types: application/javascript,application/json,application/xml,text/html,text/xml,text/plain,text/css,image/*

# 配置服务端访问地址，创建分享，激活/邀请用户时，将使用这个地址作为服务端访问地址。 对外有域名的情况下可使用域名 
datart:
  server:
    address: http://youip:youport

  user:
    active:
      send-mail: true  # 注册用户时是否需要邮件验证激活，如果没配置邮箱，这里需要设置为false


  security:
    token:
      secret: "d@a$t%a^r&a*t" #加密密钥
      timeout-min: 30  # 登录会话有效时长，单位：分钟。

  env:
    file-path: ${user.dir}/files # 服务端文件保存位置

# 可选配置 如需配置请参照 [3.2 截图配置 [ChromeWebDriver]-可选]
  screenshot:
    timeout-seconds: 60
    webdriver-type: CHROME
    webdriver-path: "http://youip:4444/wd/hub"  

```

*注意：加密密钥每个服务端部署前应该进行修改，且部署后不能再次修改。如果是集群部署，同一个集群内的secret要保持统一*


### 3.2 截图配置 [ChromeWebDriver]-可选

```bash

docker pull selenium/standalone-chrome  # 拉取docker镜像

docker run -p 4444:4444 -d --name selenium-chrome --shm-size="2g" selenium/standalone-chrome  # run

```

### 4 启动服务

*注意：启动脚本 已更新了 start|stop|status|restart*

```base
${DATART_HOME}/bin/datart-server.sh (start|stop|status|restart)
```

### 5 访问服务

*注意：没有默认用户 直接注册 成功后直接登录即可*

```base
http://youip:youport/login
```
