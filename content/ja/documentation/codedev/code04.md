
---
title: Code-04 Alea HOWTO
math: true
toc: true
weight: 5
---

## ALEA ライブラリ

Alea ライブラリを使うと、次のことができます。
- モンテカルロ測定を行う
- ビニング解析（ジャックナイフ解析）によって誤差と自己相関時間を計算する
- 測定値の関数の平均値と誤差を計算する

### モンテカルロ測定

C++ のコードに ALEA ライブラリを取り込むには、次のようにします。

    #include <alps/alea.h>
    
まず、観測量を作成する必要があります。

    alps::RealObservable obs_a("observable a");
    
ここで、コンストラクタの引数は観測量の名前を表します。測定値は "<<" 演算子を使って観測量に簡単に追加できます。例えば

    obs_a << 1.2;
    
は、数値 1.2 を観測量 `obs_a` に追加します。

どのモンテカルロシミュレーションにも熱化が必要です。一定数の熱化ステップの後、次のようにして観測量をリセットする必要があります。

    obs_a.reset(true);
    
観測量の出力は、次のように簡単に行えます。

    std::cout << obs_a;
    
完全なプログラム例を以下に示します。

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

### 観測量の関数

観測量の関数を評価することもできます。まず、測定値を含む観測量から、観測量の評価器（evaluator）を作成する必要があります。例えば、`obs_a` と `obs_b` に測定値を追加してあり、`obs_c = obs_a/obs_b` を計算したいとします。これは次のように行えます。

    alps::RealObsevaluator obseval_a(obs_a);
    alps::RealObsevaluator obseval_b(obs_b);
    alps::RealObsevaluator obseval_c;
    obseval_c = obseval_b / obseval_a;
    std::cout << obseval_c;

簡単なプログラム例は、ALPS のソースディレクトリの "test/alea" にもあります。
