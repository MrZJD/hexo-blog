---
title: Cordova Hybrid App开发-环境搭建
date: 2017-09-08 21:37:31
tags:
- Programming
- Cordova
- App开发
headtag: Cordova
headtagColor: "#69727D"
summary: Apache Cordova是一个开源的移动开发框架。允许你用标准的web技术-HTML5,CSS3和JavaScript做跨平台开发。 应用在每个平台的具体执行被封装了起来，并依靠符合标准的API绑定去访问每个设备的功能，比如说：传感器、数据、网络状态等。
photos: 
- http://ouzcfzhgs.bkt.clouddn.com/blog/20170908/214642847.jpg
- http://ouzcfzhgs.bkt.clouddn.com/blog/20170908/214656123.png
---

### 前言

![Cordova](http://ouzcfzhgs.bkt.clouddn.com/blog/20170908/214642847.jpg)
![Cordova](http://ouzcfzhgs.bkt.clouddn.com/blog/20170908/214656123.png)

<p style="display:block;">该帖子先介绍Cordova的开发环境配置，以及如何编译成Android Apk文件。后续作为一个系列，通过SPA来构建一个移动APP。</p>

### 搭建环境

1. 1.安装JDK -> 并配置到环境变量中
2. 2.安装Android Studio -> 目的是安装AndroidSDK, 以及安卓开发的模拟器和编译apk所依赖的gradle -> 也需要配置到环境变量
3. 3.可能需要单独安装gradle -> 同理配置到环境变量
4. 4.安装Cordova -> <code>npm install -g cordova<code>


### 项目构建cli

```
cordova create [AppName] [com.domain.pakName] [titleName] # 创建项目

cordova platform add android # 添加开发平台

cordova build android # 编译安卓项目

cordova run android # 运行设备测试
```

<p style="display:block;">说明</p>

1. 测试cordova所需环境是否ok -> ```cordova requirements```
2. 可能存在编译版本依赖的问题, 具体参考官网说明, 视情况安装对应版本的AndroidSDK


### 附录

* [w3cschool-Cordova教程](https://www.w3cschool.cn/cordova/cordova_overview.html)
* [Cordova中文网](http://cordova.axuer.com)
* [Gradle](https://services.gradle.org/distributions/)
* [Android Studio](http://www.android-studio.org/)
* [Oracle Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
