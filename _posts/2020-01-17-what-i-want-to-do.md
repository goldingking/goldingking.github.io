---
layout: post
permalink: /for-your-information
---





这是一篇介绍jekyll用法文章，本网站正是建立在这个工具之上。

## 注意事项

使用的jekyll b命令进行编译时，本地一直报错：

jekyll 3.8.5 | Error:  incompatible character encodings: UTF-8 and GBK

废了很大力气定位问题，找出规律：

**md文件名中不能有中文**

**categories中不能有中文**

**tag中不能有中文**



## 文章编写

文章编辑器我使用typora，实时渲染markdown标签到编辑器内，可以实时看到选然后的效果，所见即所得。



## 基于的框架

本网站是基于jekyll这个软件生成,  这是一个ruby程序，用于生成静态网站。jekyll要求我们按一定结构组织文件，然后使用jekyll程序将将我们的源码编译成静态网站输出到指定文件夹中。



## 基本使用方法

推送给github中，github中已经有jekyll环境，会立刻编译并部署，如本网站。

本地使用：

jekyll b



## 帮助文档

https://jekyllrb.com/docs/