
---
title: Code-03 モンテカルロ HOWTO
math: true
toc: true
weight: 4
---

## はじめに

ALPS のアプリケーションにはすでにいくつかのモンテカルロ（MC）プログラムが用意されていますが、ALPS の主な目的は、開発者が独自の MC プログラムをできるだけ簡単かつ迅速に作成できるよう支援することです。すべての MC アルゴリズムに共通する作業がいくつかあり、それらを毎回プログラムし直す必要はありません。この記事の目的は、ALPS ライブラリがそのための簡単なフレームワークを提供していることを示し、その使い方を例を通して説明することです。これには古典モンテカルロと量子モンテカルロの両方のアルゴリズムが含まれます。
ALPS のソースのディレクトリ `example/scheduler` には、イジングモデルのシミュレーションコードの例が含まれており、必要に応じて改変して利用できます。以下では、これらの例について説明します。

### 新しい MC アプリケーションを開発する際に、独自のツールではなく ALPS ライブラリを使う利点は何でしょうか？

- 誤差棒と自己相関時間の自動計算
- 自動並列化
- 結果の自動出力（XML 形式）と、それに対応するデータ抽出ツール
- 符号の自動管理（負符号問題のある量子モンテカルロシミュレーションの場合）
- 簡単なチェックポイント作成とシミュレーションの簡単な再開
- 入力パラメータの簡単な管理
- 新しい測定を簡単に追加する手段
- 乱数の簡単な管理
- （オプション）格子の簡単な管理
- （オプション）量子ハミルトニアンの簡単な管理（量子モンテカルロの場合）
- ...

これらはすべて、これから説明するわずかなプログラミングや修正だけで利用できます。

## 独自の ALPS MC プログラムを始める

**作業中です……このチュートリアルは未完成で、校正もされていません……このページについてのコメントや提案があればお寄せください**

まず、ALPS ライブラリを使うということは、プログラミング言語として C++ を使うことを意味します。以下では、新しい MC アプリケーションをプログラムしたいと考えており、内部データ構造と、1 モンテカルロステップで用いるアルゴリズムはすでに決まっているものとします。
ALPS ライブラリを使うには、ALPS の内部クラスから派生した独自の C++ クラスを作成する必要があります。このクラスを `MyMonteCarlo` と呼ぶことにし、ヘッダファイル `MyMonteCarlo.hpp` を作成します。

    #ifndef MYMC_HPP
    #define MYMC_HPP
    #include <alps/scheduler.h>
    #include <alps/alea.h>
    #include <alps/scheduler/montecarlo.h>
    #include <alps/osiris.h>
    #include <alps/osiris/dump.h>
    #include <alps/expression.h>
    using namespace std;
    class MyMonteCarlo : public alps::scheduler::MCRun{
    public :
        MyMonteCarlo(const alps::ProcessList &,const alps::Parameters &,int);
        static void print_copyright(std::ostream &);
        void save(alps::ODump &) const;
        void load(alps::IDump &);
        void dostep();
        bool is_thermalized() const;
        double work_done() const;
    private :
        // your own internal data here ...
    };
    #endif

これらの行がそれぞれ何を意味するかを見ていきます。
- まず、いくつかの ALPS ヘッダをインクルードする必要があります（ALPS の他の機能を使う場合は、ここにさらにヘッダを追加します）。
- 次に、ALPS のクラスから派生させて `MyMonteCarlo` クラスを定義します。上記のヘッダファイルでは、最も単純な ALPS クラスである `MCRun` を使います。ALPS の格子機能を利用したい場合は、クラス定義の行を次のように置き換えます。

    class MyMonteCarlo : public alps::scheduler::LatticeMCRun<>{

さらに、ヘッダに次を追加します。

    #include <alps/lattice.h>
    
さらにモデルライブラリ（格子上の量子モデルに便利です）も使いたい場合は、代わりに次を使います。

    class MyMonteCarlo : public alps::scheduler::LatticeModelMCRun<>{

- public 部の `MyMonteCarlo(const alps::ProcessList&,const alps::Parameters&,int)` はクラスのコンストラクタで、すべてのパラメータを初期化するために必要です。
- `print_copyright(std::ostream&)` は、各シミュレーションの開始時に出力したい有用な情報を出力するための簡単な関数です。
- save 関数と load 関数は非常に便利な関数で、各チェックポイントの後にシミュレーションを再開するために、ディスクに保存（ディスクから読み込み）する必要があるものを記述します。
- dostep 関数はメインの MC 関数で、MC ステップごとに実行される関数です。
- `is_thermalized` 関数は、シミュレーションの熱化部分がいつ終わったか（すなわち、いつ測定を開始できるか）を ALPS ライブラリに伝えます。
- `work_done` 関数は、シミュレーションのうちどれだけの割合がすでに完了したかを ALPS ライブラリに伝えます。

残りの作業は、これらの関数を自分のプログラムと正しく結び付けることです。これは、例えば `MyMonteCarlo.cpp` という名前のファイルで行います。

## 独自の ALPS MC プログラムを構築する

### copyright 関数

まず、ファイル `MyMonteCarlo.cpp` の中で最も簡単な関数 `print_copyright()` から始めます。

    #include "MyMonteCarlo.hpp";
    /************************************ ALPS functions **********************************************/
    // Copyright statement
    void MyMonteCarlo::print_copyright(std::ostream & out)
    {
        out << "My own ALPS Monte Carlo program v. 0.1\n"
            << "  copyright (c) 2006 by Myself,\n"
            << "  available from the author on request\n\n";
    }

### モンテカルロステップの管理

次に、MC ステップの管理に注目します。典型的な状況は次のようなものです。まず熱化のために決まった数のステップを行い、その後、測定部分のために決まった数のステップを行います。また多くの場合、各測定の間に一定数のモンテカルロステップを行いたいこともあります。そこで、内部データ構造に次の変数を（`MyMonteCarlo.hpp` の中で）定義しておくと便利です。

    private :
        // your own internal data here ...
        int Nb_Steps; 
        int Nb_Thermalisation_Steps; 
        int Each_Measurement;
        int Steps_Done_Total; 
        int Measurements_Done;
        void do_update();
        void do_measurements();
        // the rest of your own internal data here ...
    };
    
ここで `Nb_Thermalisation_Steps` は指定する熱化ステップ数、`Nb_Steps` は熱化後に指定するステップ数です。`Each_Measurement` は各測定の間のステップ数です。これら 3 つの数は、後でコンストラクタの中で初期化します。`Steps_Done_Total` には、（熱化のステップも含めて）現在までに完了した MC ステップ数を格納します。最後に、`Measurements_Done` には、各測定の間に行われた途中のステップ数を格納します。`do_update()` 関数と `do_measurements()` 関数（これらは自分で定義する必要があります）は、それぞれ 1 回の MC ステップと一連の測定を行います。
これらの定義から、`MyMonteCarlo.cpp` におけるクラスのメンバ関数は次のように簡単に定義できます。

    bool MyMonteCarlo::is_thermalized() const
    {  return (Steps_Done_Total >= Nb_Thermalisation_Steps); }

この関数は、現在の MC ステップ数が指定した熱化ステップの総数以上であれば 1 を、そうでなければ 0 を返します。2 つ目の関数

    double MyMonteCarlo::work_done() const
    { return (is_thermalized() ? (Steps_Done_Total-Nb_Thermalisation_Steps)/double(Nb_Steps) :0.); }

は、シミュレーションが熱化していなければ 0 を返し、熱化していれば、指定した測定ステップのうちすでに実行された割合に対応する 0 から 1 の間の数を返します。最後に、`dostep()` 関数は次のようになります。

    void MyMonteCarlo::dostep()
    { do_update(); // you'll have to define what this function does later
      ++Steps_Done_Total; // increment the number of steps done
      if (is_thermalized()) // do measurements only if simulation thermalized
        { if (++Measurements_Done==Each_Measurement) // do a measurement every Each_Measurement
            { Measurements_Done=0;
            do_measurements(); // you'll have to define what this function does later
            }
        }
    }
    
もちろん、どこかの時点で、1 回の MC ステップの間にプログラムが実際に何を行うかを定義する必要があり、それは `do_update()` 関数で行います。これについてはお手伝いできません！ この例では、測定は以下で説明する `do_measurements()` 関数にまとめてあります。

### save 関数と load 関数

ALPS では、チェックポイントとしてディスクに保存する内部データを簡単に扱えます。シミュレーションを再開できるようにするために、内部データ構造のうち、いくつかの整数と double の配列をチェックポイントとして保存する必要があるとしましょう。

    private :
        // the rest of your own internal data here ...
        int Number_of_Spins; 
        int MyOwnVariable;
        std::vector<double> SpinArray;
        ...
    };
    
これは、次のように書くだけで非常に簡単に実現できます。

    void MyMonteCarlo::save(alps::ODump& dump) const
        { dump <<  Number_of_Spins << MyOwnVariable << SpinArray;}

load 関数は、容易に想像できるように次のようになります。

    void MyMonteCarlo::load(alps::IDump& dump) const
        { dump >>  Number_of_Spins >> MyOwnVariable >> SpinArray;}
        
この方法で通常の型（int、double、bool など）のほとんどをダンプでき、また標準コンテナの多く（vector や set など）も利用できることに注意してください。
次に、独自の小さな内部構造体を作ったとしましょう。

    struct Vertex
        { int vertex_type;
        std::vector<double> coordinates;
        int SomeOtherVariable; }
        
そして、そのインスタンスをモンテカルロクラスの中で保存したいとします。

    private :
        // the rest of your own internal data here ...
        Vertex MyVertex; 
        ...
    };
    
その場合は、構造体の中で何を保存・読み込みするかを ALPS に教えるだけです。

    alps::ODump& operator<<(alps::ODump& dump, const Vertex& v)
    { return dump << v.vertex_type << v.coordinates; }

    alps::IDump& operator>>(alps::IDump& dump, Vertex& v)
    { return dump >> v.vertex_type >> v.coordinates;}
    
そうすれば、ALPS のメインの save 関数と load 関数に MyVertex を簡単に追加できます。

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;}

上で説明したモンテカルロステップの管理を使っている場合は、これも save/load 関数に追加しておくとよいでしょう。

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;
        dump <<  Nb_Steps << Measurements_Done; }

### `do_measurements()` 関数

この関数では測定を行い、その結果を処理のために ALPS に渡します。これはとても簡単です。

    void MyMonteCarlo::do_measurements()
    { double Energy; std::valarray<double> Correl(L);
     // do the measurements in your code (update the Energy and Correl variable) ...
     ...
     // give them to ALPS
     measurements["Energy"] << Energy;
     measurements["Spin Correlations"] << Correl;
   }
   
これだけでしょうか？ ここで疑問に思うかもしれません。ALPS は "Energy" や "Spin Correlations" が何であるかをどうやって知るのでしょうか？ スカラーの測定（ここでの Energy など）とベクトルの測定（Correl など）をどうやって区別するのでしょうか？ これら 2 つの疑問には、以下のクラスのコンストラクタのところで答えます。
もう 1 つの疑問は、なぜベクトル観測量に `std::vector` ではなく `std::valarray` を使ったのか、ということかもしれません。これは ALPS の内部的な理由によるものですが、ベクトル観測量については、異なる測定ごとにベクトルのサイズが**常に**同じでなければならないことだけは覚えておいてください（この例では、Correl オブジェクトのサイズが常に同じ（ここでは L）でないと、measurements["Spin Correlations"] は失敗します）。

### コンストラクタ

コンストラクタで行うべきことは、基本的に次の 3 つです。
- 与えられたパラメータから読み込んで、シミュレーションのパラメータを初期化する
- スピン配置など、その他の内部変数を初期化する
- 上の do_measurements() 関数で使う観測量を定義する

コンストラクタは次のようになります。

    MyMonteCarlo::MyMonteCarlo(const alps::ProcessList& where,const alps::Parameters& params,int node) : alps::scheduler::MCRun(where,params,node),
    Nb_Steps(params.value_or_default("SWEEPS",1000)),
    Nb_Thermalisation_Steps(static_cast<alps::uint32_t>(params["THERMALIZATION"])),
    Number_of_Spins(alps::evaluate<alps::uint32_t>(params["L"],params)),
    T(params.defined("T") ? static_cast<double>(params["T"]) : 1./static_cast<double>(params["beta"])),
    Steps_Done_Total(0),
    SpinArray(Number_of_Spins,0),    //Initialize the std::vector with size Number_of_Spins and set all values to 0
    //...
    {
    for (std::vector<int>::iterator iter=SpinArray.begin(); iter!=SpinArray.end(); ++iter)
        *iter=random_int(-1,1);
    //...    
   
    measurements << alps::RealObservable("Energy");               //With binning
    measurements << alps::SimpleRealObservable("Magnetization");  //Without binning
   
    alps::RealVectorObservable::label_type correlationlabels;
    // set correlationlabels using push_back() ...
    measurements << alps::RealVectorObservable("Spin Correlations",correlationlabels);
    }

このように、`params` オブジェクトからパラメータを読み込む方法はいくつかあります。観測量の定義は、その型とラベルを与えるだけで行えます。
なお、`alps/scheduler/montecarlo.h` をインクルードすることで、ALPS が提供する次の乱数関数も使えるようになります。

    random_int(int a, int b);         //from [a,b]
    random_int(int n);                //from [0,n)
    random_real(double a, double b);  //from (a,b)
    random_real();                    //from (0,1)

（これらは ALPS によって提供されています。）

## ALPS コードの実行

コードを実行するには、`MyMonteCarlo.h` に次の typedef を追加しておくと便利です。

    typedef alps::scheduler::SimpleMCFactory<MyMonteCarlo> MyMonteCarloFactory;

これで、例えば `.../alps/example/scheduler/main.C` のような簡単な `main.C` の中で、次のように呼び出せます。

    int main(int argc, char** argv)
    {
        // ...
        return alps::scheduler::start(argc,argv,MyMonteCarloFactory());
        // ...
    }
    
コンパイルとリンクの後、`./MyMonteCarlo parm.in.xml` でシミュレーションを開始すれば、それで完了です。

## ALPS の格子機能を使う

スケジューリングと測定の処理だけでなく、格子の操作も ALPS に任せたい場合は、`LatticeMCRun` クラスを使えます。モンテカルロコードを次のように定義します。

    typedef alps::scheduler::LatticeMCRun<>::graph_type graph_type;
    class MyLatticeMonteCarlo : public alps::scheduler::LatticeMCRun<graph_type> { ... }
    
シミュレーションの実行時には、どのような格子を使いたいかを、パラメータファイルを通じてクラスに伝える必要があります。例えば

    LATTICE = "square lattice"
    
または

    LATTICE = "honeycomb lattice"
    
あらかじめ定義された格子が多数あり、`/alps/2.x.x/lib/xml/lattices.xml` で確認できます。独自の格子を定義する方法は[こちら](../../intro/latticehowtos/intro)で説明しています。

### はじめに

基本的に、ALPS は格子を表す `boost::graph` のオブジェクトを生成します。この強力なデータ構造により、グラフの頂点と辺を簡単かつ効率的にたどることができます。なお、ALPS の用語では、Boost の vertices、edges、adjacent_vertices の代わりに、sites（サイト）、bonds（ボンド）、neighbors（隣接サイト）という言葉を使います。特定のサイトにアクセスするために、このデータ構造は site_descriptor というデータ型を使います。特に何も定義しなければ、格子の site_descriptor は int 型（より正確には `alps::uint32_t` 型）になります。これにより、site_descriptor を、系の配置を格納する（private な）配列（あるいは vector など）のインデックスとして使うことができます。言い換えると、格子上のデータの内容（スピンの値や占有数など）は自分で管理する必要があります！ ALPS の格子機能は、あるサイトの隣接サイトの site_descriptor や、そのサイトから出るボンドの bond_descriptor を簡単に提供する役割を担います。
さらに、いわゆる site_iterator を用いて、サイト、ボンド、隣接サイトについて反復処理を行うことができます。site_iterator は、site_descriptor へのポインタと次の site_iterator へのポインタを持つ、単なるリストの要素です。bond_iterator も同じように動作します。したがって、すべてのサイトの全体は、全サイトのリストの最初と最後の要素へのポインタから成る `std::pair<site_iterator, site_iterator>` として表すことができます。これがまさに `sites()` が返すものです。

### すべてを含んだ例

この節では、重要な機能のほとんどを含むコード例を示します。イジングスピン系のエネルギー測定を、次のそれぞれの方法で重ねて実装します。
すべてのボンドについての反復
すべてのサイトについての反復と、それに続くそのサイトの隣接サイトについての反復
すべてのサイトについての反復と、それに続くそのサイトから出る辺についての反復
コンストラクタでのスピンベクトルの初期化は、例えば次のようになります。
 `std::vector<int> spins(num_sites())`;
 
    site_iterator s_iter;
    for (s_iter = sites().first; s_iter!=sites().second; ++s_iter)
        spins[*s_iter]=random_int(0,1);

ここでは、`LatticeMCRun` クラスの 2 つの関数 `num_sites()`（サイト数を返す）と `sites()`（site_iterator の `std::pair` を返す）が使われています。iter が指す site_descriptor を、スピンベクトルのインデックスとして使うことができます。
`do_step()` 関数の一部としてのエネルギーの測定は、例えば次のようになります。

    double E = 0.0;
    int index1, index2;
    for (bond_iterator b_iter=bonds().first; b_iter!=bonds().second; ++b_iter) {
        index1 = source(*b_iter);
        index2 = target(*b_iter);
        E += (spins[index1]==spins[index2])? J : -J ;            // where J is the coupling constant
    }
    //...
    measurements["Energy"] << E/num_sites();
    
この版では、サイトについての反復と同様にすべてのボンドについて反復し、site_descriptor を返す source(bond_descriptor b) と target(bond_descriptor b) によって、ボンドの両端にある 2 つのサイトにアクセスできます。

隣接サイトの扱いを含む別の方法は次のとおりです。

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_iterator n_iter;
        for (n_iter=neighbors(*s_iter).first; n_iter!=neighbors(*s_iter).second; ++n_iter) {
            E += (spins[*s_iter]==spins[*n_iter])? 0.5*J : -0.5*J ;            // where J is the coupling constant, factor 1/2 because of double-counting
        }
    }

3 つ目の方法では、あるサイトから出るボンドをたどります。

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_bond_iterator nb_iter;
        for (nb_iter=neighbor_bonds(*s_iter).first; nb_iter!=neighbor_bonds(*s_iter).second; ++nb_iter) {
            E += (spins[source(*nb_iter)]==spins[target(*nb_iter)])? 0.5*J : -0.5*J ;
        }
    }
    
最後に、ランダムなサイトやランダムなボンドにアクセスしたい場合は、site(int site_no) と bond(int bond_no) を使えます。

    site_descriptor randomsite = site(random_int(num_sites() ) );
    bond_descriptor randombond = bond(random_int(num_bonds() ) );
