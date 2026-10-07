
---
title: Code-04 Alea 使用指南
math: true
toc: true
weight: 5
---

## ALEA 库

Alea 库可以用于
- 进行蒙特卡洛测量
- 通过分箱分析（Jackknife 分析）计算误差和自相关时间
- 计算测量量的函数的平均值和误差

### 蒙特卡洛测量

在 C++ 代码中通过以下方式包含 ALEA 库

    #include <alps/alea.h>
    
首先需要创建一个观测量

    alps::RealObservable obs_a("observable a");
    
其中构造函数的参数表示观测量的名称。使用 "<<" 运算符即可方便地向观测量中添加测量值。例如

    obs_a << 1.2;
    
会将数值 1.2 添加到观测量 `obs_a` 中。

每个蒙特卡洛模拟都需要热化。在一定数量的热化步之后，需要通过以下方式重置观测量

    obs_a.reset(true);
    
输出一个观测量也很简单

    std::cout << obs_a;
    
下面是一个完整的示例程序：

    #include <iostream>
    #include <alps/alea.h>
    #include <boost/random.hpp> 

    int main()
    {
        //DEFINE RANDOM NUMBER GENERATOR
        typedef boost::minstd_rand0 random_base_type;
        typedef boost::uniform_01<random_base_type> random_type;
        random_base_type random_int;
        random_type random(random_int);

        //DEFINE OBSERVABLE
        alps::RealObservable obs_a("observable a");

        //ADD 1000 MEASUREMENTS TO THE OBSERVABLE
        for(int i = 0; i < 1000; ++i){ 
            obs_a << random();
        }

        //RESET OBSERVABLES (THERMALIZATION FINISHED)
        obs_a.reset(true);

        //ADD 10000 MEASUREMENTS TO THE OBSERVABLE
        for(int i = 0; i < 10000; ++i){
            obs_a << random();
        }

        //OUTPUT OBSERVABLE
        std::cout << obs_a;       
    }

### 观测量的函数

可以对观测量的函数进行求值。首先需要从包含测量值的观测量创建观测量求值器（observable evaluator）。例如，假设我们已经向 `obs_a` 和 `obs_b` 添加了测量值，并想计算 `obs_c = obs_a/obs_b`。这可以通过以下方式实现

    alps::RealObsevaluator obseval_a(obs_a);
    alps::RealObsevaluator obseval_b(obs_b);
    alps::RealObsevaluator obseval_c;
    obseval_c = obseval_b / obseval_a;
    std::cout << obseval_c;

简单的示例程序也可以在 ALPS 源代码目录的 "test/alea" 中找到。
