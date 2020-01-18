---
layout: post
title:  "贝叶斯定律"
categories: examination
tag: probability
---

[贝叶斯定律](https://www.zhihu.com/question/19725590)：新信息出现后A的概念=A的概率x新信息带来的调整

P(A|B)=P(A)*p(B|A)/P(B)

已知两个一维模式类别的类概率密度函数为:

![img](https://uploadfiles.nowcoder.com/images/20160829/59_1472451822933_E39598100A5E449D6E3F3A28AB61F54B)

先验概率P(ω1)=0.6;P(ω2)=0.4,则样本{x1=1.35,x2=1.45,x3=1.55,x4=1.65}各属于哪一类别?

解题思路：比较后验概率 p(ω|x) , 哪个类的后验概率大 , 就属于哪个类