---
layout: post
title:  "java错题"
categories: java
---

1. java 数组不属于原生类型
2. ServletConfig包含servlet的配置信息
3. 描述事物的最小单位是数据项
4. sql是非过程化的语言
5. java、javac、jar等工具也是使用java编写的
6. 概念模型也称信息模型是站在用户角度对数据和信息建模
7. java的访问修饰符：public、protected、default（默认）、private，访问修饰符同样可以修饰类，外部类相当于外层只有包，所以default适用，同时public也适用；如果是内部类，可以类比成员变量，可以用protected、public、default、private修饰；如果是函数局部类，类比局部变量，只能在函数作用域访问，不能用任何修饰符
8. float f=1.0 会报错，因为1.0默认是double双精度，赋值给float会损失精度；float f=1不会报错，因为1默认是int，int赋值给float会增加精度。
9. servlet不是线程安全的，所以不要在servlet的