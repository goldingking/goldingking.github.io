---
layout: post
title:  "事务特性"
categories: database
---

事务4大特性

1. 原子性，多个sql操作要么都执行，要么都不执行
2. [一致性](https://www.zhihu.com/question/31346392)，系统的前后状态是一致的，这个由其他三个特性来保证，还要由系统自己保证
3. 隔离性,   事务的并发执行要相互隔离，但是隔离程度受隔离级别影响
4. 持续性，事务对数据库的影响要是永久的

[事务传播行为](https://segmentfault.com/a/1190000013341344)：用来描述某一个由事务传播行为修改的方法被嵌套进另一个方法的时候事务该如何传播

1. PROPAGATION_REQUIRED
2. PROPAGATION_SUPPORTS
3. PROPAGATION_MANDATORY
4. PROPAGATION_REQUIRED_NEW
5. PROPAGATION_NOT_SUPPORTS
6. PROPAGATION_NEVER
7. PROPAGATION_NESTED

