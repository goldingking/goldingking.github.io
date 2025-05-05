---
layout: post
title:  "JPA分页查询中缺陷"
categories: database
tag: JPA
---

使用jpa进行分页查询，查询的主要对象同时关联了其他对象，也是通过jpa的注解进行关联。现在这个主要对象的列表高达7万个，每个列表项目又关联了2个子对象，子对象一共有14万个。在进行分页查询时，主对象按照分页规定的大小返回了列表，但是其关联的子对象却没有根据分页来查询，而是把所有符合条件的主对象关联的子对象都查出来了，造成内存消耗很大。

子对象和主对象的关联方式是fetchmode=subselect，这种方式会生成一个in查询，in是主对象的列表。而in里面的的查询并没有分页条件，造成查出7万条数据，内存大量被占用。

通过将fetchmode由subselect改为join模式，jpa会先查出主对象列表，然后根据每一个列表项目发起一个子对象查询，这种方式虽然会发起多个sql查询，但是不会出现上面内存被大量占用的情况。

### jpa中各种实体之间的关系：

[多对多关系]([https://baike.baidu.com/item/%E5%A4%9A%E5%AF%B9%E5%A4%9A%E5%85%B3%E7%B3%BB/665737](https://baike.baidu.com/item/多对多关系/665737))需要有一个中间表来记录双方的关联关系，中间表将一个多对多关系分解成两个一对多关系，比如订单表和产品表中间有一个订单明细表

一对一关系：相当于把一条记录垂直切分成两个更短的记录，两个记录之间是一对一关系

一对多关系：比如一个班级包含多个学生，班级和学生的关系就是一对多关系，反过来就是多对一关系

### hibernate的优化方法:

[缓存]([https://baike.baidu.com/item/hibernate%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6](https://baike.baidu.com/item/hibernate缓存机制))restful api有缓存机制，数据库同样有，这些缓存机制可以增加系统额吞吐量，降低的资源的使用

配置对象缓存，不使用[集合缓存](https://blog.csdn.net/taiyangdao/article/details/52054068)

hibernate的[继承](https://www.cnblogs.com/hvicen/p/6337871.html)

