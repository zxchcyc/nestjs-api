## Description

### 目录说明

```bash
# 环境变量 可以在 package.json 配置目录的路径 默认是 ../config
config 

# 项目文档
docs 

# 涉及到的一些库是使用示例
sample 

# 项目脚本文件
scripts

# 项目源码
src

# nestjs 框架层面一些相关的技术
src/common

# 不以环境变更而改变的一些配置，如：端口
src/common/constants

# 项目需要的一些枚举类型 比如：HTTP 状态码，错误码
src/common/enums

# 项目需要的一些接口类型
src/common/interfaces

# 控制器层基类 抽象一些公用的属性和方法
src/common/controllers

# 服务层基类 抽象一些公用的属性和方法
src/common/services

# 数据层基类 抽象一些公用的属性和方法
src/common/models

# 中间件 比如日志追踪ID添加
src/common/middlewares

# 校验 比如入参校验
src/common/pipes

# 异常过滤器
src/common/filters

# 拦截器 比如用于接口正常返回封装 和 接口响应时间记录
src/common/interceptors

# 自定义装饰器
src/common/decorators

# 项目与外部服务交互的服务 比如：队列、日志、短信等等
# 所有与外部服务交互都必须走这里的服务出去 不能直接在业务模块调用外部服务
src/external 

# 邮件服务
src/external/email

# 文件服务
src/external/file

# 短信服务
src/external/sns

# 公司内部日志服务
src/external/logger

# 公司内部 kafka 服务
src/external/kafka

# 公司内部 sqs 服务
src/external/sqs

# 公司内部 http 服务
src/external/http

# webhook 服务
src/external/webhook

# 项目内部支撑服务 比如：数据库、缓存、环境变量、国际化
# 注意 工具类也在这里边 
# 数据库和缓存都支持多库配置
src/internal

# 项目业务模块
src/modules

# 定时任务相关模块
src/tasks
```

### 企业内部系统交互

```bash
http 验证方式,目前有两种方案
1、使用 x-api-key 直接验证，特点是简单，缺点是不够安全。
2、使用非对称加密，特点是安全，缺点是速度慢些，每个内部系统加入都要手动维护公钥。

超时机制
1、超时重试机制

异常处理
1、第三方服务异常前端展示方式

调用日志
1、保存调用日志
```

### JWT 前端使用

```bash
accessToken 过期时间 60s
refreshToken 过期时间 16h
前端需要在 accessToken 过期的时候利用 refreshToken 刷新
```

### 常量类型使用

```bash
全局使用 在 common/constants
各个业务模块维护自己的 constants.ts 文件
```

### 接口类型使用

```bash
全局使用 在 common/interface
各个业务模块维护自己的 interface.ts 文件
```

### 枚举类型使用

```bash
全局使用 在 common/enums
各个业务模块维护自己的 enums.ts 文件
```

### 接口入参校验和出参限制

```bash
# 接口入参校验 参考 user 模块 
# 问题：query 参数都是字符串 目前没有校验 请使用 body 代替
dto 文件
# 接口出参限制 参考 user 模块
cmd 文件
```

### 接口返回和手动抛出异常的约定

```bash
#  一般用不到 系统会自动处理异常
#  抛出 HTTP 子类异常 参数是错误信息 和 错误码 都必须传
throw new BadRequestException(errors, 'A0101');

#  抛出 HTTP 异常
throw new HttpException(
  {
    # 错误码
    errorCode: 'A0102', 

    # 错误信息 错误栈 
    message: '手动抛出 HttpException', 
  },

  # HTTP 状态码
  500, 
);

#  常用的
#  接口正常返回
return {

  # 不填前端就没有这个字段
  result, 
};

# 如果是业务异常 错误码必须传
return {

  # 不填前端就没有这个字段
  result, 
  
  # 错误码 必传
  errorCode: 'A0001', 
};
```

### env 文件格式

```bash
目录可以根据需求配置到服务器任何目录
由 package.json 启动脚本指定目录路径即可

文件命名
.env.dev
.env.uat
.env.prod

相关字段
WEBHOOK_URL='https://oapi.dingtalk.com/robot/send?access_token=1fa63e87eaf419dfa71380cb067bc75875040b87f0969644a83cfbdaabcf60dc'

```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# uat mode
$ npm run start:uat

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
