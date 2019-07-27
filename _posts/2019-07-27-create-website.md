---
layout: post
title:  "如何在github上托管静态网站"
date:   2019-07-27 09:33:23 +0800
categories: github
tag: 教程
---



本文主题是如何快速搭建一个基于github的静态网站

在github上创建一个仓库地址，仓库名为[github用户名].github.io, 在此仓库中上传一个项目，github自动编译成静态网站，并可以使用[github用户名].github.io来访问。

此项目是基于[jekyll](https://jekyllrb.com/)生成的工程的，我们来看下jekyll网站的工程结构。

```
├─assets #一些静态资源，比如图片
│  ├─background
│  ├─cursor
│  ├─live2d
│  │  ├─Potion-Maker
│  │  │  ├─motions
│  │  │  ├─Pio
│  │  │  │  ├─motions
│  │  │  │  └─textures
│  │  │  ├─textures
│  │  │  ├─Tia
│  │  │  │  ├─motions
│  │  │  │  └─textures
│  │  │  └─xiaoban
│  │  │      ├─model.2048
│  │  │      └─motions
│  │  └─src
│  │      └─lib
│  └─time
│      ├─css
│      └─js
│          └─flipclock
│              ├─faces
│              └─libs
├─_drafts
├─_includes
├─_layouts #页面的骨架
├─_posts # 存放文章
└─_site #最终编译出来的静态网站
    ├─about
    ├─assets
    │  ├─background
    │  ├─cursor
    │  ├─live2d
    │  │  ├─Potion-Maker
    │  │  │  ├─motions
    │  │  │  ├─Pio
    │  │  │  │  ├─motions
    │  │  │  │  └─textures
    │  │  │  ├─textures
    │  │  │  ├─Tia
    │  │  │  │  ├─motions
    │  │  │  │  └─textures
    │  │  │  └─xiaoban
    │  │  │      ├─model.2048
    │  │  │      └─motions
    │  │  └─src
    │  │      └─lib
    │  └─time
    │      ├─css
    │      └─js
    │          └─flipclock
    │              ├─faces
    │              └─libs
    ├─h5
    │  └─2019
    │      └─06
    │          └─06
    └─health
        └─2019
            └─06
                └─09
```





