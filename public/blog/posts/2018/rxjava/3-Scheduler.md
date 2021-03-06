---
date: 2018-05-05
tags: 
  - "RxJava"
  - "Java"
categories:
  - "Coding"
prev: 2-Operator.md
next: 4-BackPressure.md
---

# 理解RxJava与响应式(3) - 线程调度

RxJava 为我们提供了两个调度操作符`subscribeOn`和`observeOn`.

[Sample Code](https://github.com/XDean/Share/blob/master/src/main/java/xdean/share/rx/ReactiveChapter3.java)

## How they work

![Scheduler.png](images/Scheduler.png)

## Delay error

![SchedulerDelayError.png](images/SchedulerDelayError.png)

## Schedulers

- `computation`
- `io`
- `single`
- `newThread`
- `trampoline`