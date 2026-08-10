
---
title: ALPS using the command line
toc: true
weight: 2
---

## 入力の準備

ジョブファイルやタスクファイルの XML 形式を日常的に直接扱いたくはないでしょうから、`parameter2xml` ツールを使えば、シミュレーションのパラメータをプレーンテキストのファイルで指定でき、それを自動的に XML に変換してくれます。

`parameter2xml` ツールは、プレーンテキストのパラメータファイルを、[はじめに](../intro) で説明した XML 形式のジョブファイルおよび必要なすべてのタスクファイルに変換します。パラメータファイルは、次のような形式のパラメータ代入の並びから構成されます。

    MODEL="Ising";
    SWEEPS=1000;
    THERMALIZATION=100; 
    WORK_FACTOR=L*SWEEPS;
    { L=10; T=0.1; }
    { L=20; T=0.05; }

波括弧 {...} のブロック内にある代入の各グループは、1つのタスクに対するパラメータの組を表します。波括弧のブロックの外にある代入は、その定義以降のすべてのタスクに対してグローバルに有効です。文字列は "Ising" のように二重引用符で与えます。

次の2つのパラメータには特別な意味があります。

| **パラメータ** | **既定値** | **意味** |
| :------------ | :---------- | :---------- |
| SEED | 0 | 次に作成されるモンテカルロ実行で使われる擬似乱数生成器のシード値。あるシードが実行の作成に使われると、この値は1だけ増加します。 |
| WORK_FACTOR | 1 | 負荷分散において、あるシミュレーションに必要な作業量に乗じられる係数。 |

`parameter2xml` を呼び出す構文は次の通りです。

    parameter2xml [-f] parameterfile [xmlfileprefix]

これはパラメータファイルを一連の XML ファイルに変換し、オプションの第2引数として与えられた接頭辞から始まる名前を付けます。この第2引数の既定値は、パラメータファイル自身の名前です。
`parameter2xml` ツールは、これらの名前を持つ出力 XML ファイルが既に存在するかどうかを確認し、本当に上書きしてよいかを尋ねます。`-f` オプションを使うと、`parameter2xml` に強制的にそれらを上書きさせることができます。

## プログラムの起動

### シリアルマシン上でシミュレーションを実行する

シミュレーションは、まずジョブファイルを作成し、次にその XML ジョブファイルの名前を引数としてプログラムに与えることで開始されます。この例ではプログラムを `my_program` と呼ぶことにすると、実行の手順は次のようになります。

    parameter2xml parm job 
    my_program job.in.xml

結果はファイル `job.out.xml` に保存され、このファイルは3つのシミュレーションの結果に対応するファイル `job.task1.out.xml`、`job.task2.out.xml`、`job.task3.out.xml` を参照します。

#### コマンドラインオプション

このプログラムは、スケジューラの挙動を制御するための、いくつかのコマンドラインオプションを取ります。これらのオプションは、モンテカルロシミュレーションで特に有用です。

| **オプション** | **既定値** | **説明** |
| :--------- | :---------- | :-------------- |
| --time-limit timelimit | 無限大 | 最終チェックポイントを書き出して終了するまでにプログラムが実行してよい時間（秒）を指定します。 |
| --checkpoint-time checkpointtime | 1800 | プログラムがチェックポイントを書き出すべき間隔の時間（秒）を指定します。 |
| --Tmin checkingtime | 60 | スケジューラがシミュレーションの終了を（再度）確認するまでに待つ最小時間（秒）を指定します。 |
| --Tmax checkingtime | 900 | スケジューラがシミュレーションの終了を（再度）確認するまでに待つ最大時間（秒）を指定します。 |
| --write-xml | | このオプションを指定すると、結果は `.out.xml` ファイルにも書き出されます。指定しない場合、結果は HDF5 ファイルにのみ書き出されます。 |

### 並列マシン上でシミュレーションを実行する

並列マシン上でシミュレーションを実行するのは、シリアルマシン上で実行するのと同じくらい簡単です。ここでは Open MPI を用いた例を示します。MPI 環境を起動するための別個のステップは不要で、`mpirun` を使って直接プログラムを並列に実行できます（複数ノードで実行する場合は `--hostfile` でホストファイルを指定してください）。例えば、4プロセスで実行するには次のようにします。

    parameter2xml parm job 
    mpirun -np 4 my_program --mpi job.in.xml

#### コマンドラインオプション

シリアル版プログラムのコマンドラインオプションに加えて、並列版プログラムにはさらに2つのオプションがあります。

| **オプション** | **既定値** | **説明** |
| :--------- | :---------- | :-------------- |
| --mpi | | プログラムを MPI モードで実行するよう指定します |
| --Nmax numprocs | 無限大 | 1つのシミュレーションに割り当てるプロセス数の上限を指定します。 |
| --Nmin numprocs | 1 | 1つのシミュレーションに割り当てるプロセス数の下限を指定します。 |

シミュレーションの数より利用可能なプロセッサの数の方が多い場合、1つのシミュレーションに対して複数のモンテカルロ実行が開始されます。

## シミュレーション結果の解析

シミュレーション中には、（シミュレーションコード内で指定・実装された）いくつかの物理量の期待値が測定され、それぞれのタスクファイルに保存されます。あるシミュレーションで生成されたタスクファイルをアーカイブしたり、それらのファイルやアーカイブからデータを取り出したりするために、いくつかのツールが以下で説明されています。

### `convert2xml`

シミュレーションの出力ファイルには、すべての実行から集約された測定値のみが含まれています。個々のモンテカルロ実行についての詳細情報は、`convert2xml` ツールを使ってチェックポイントファイルを XML に変換することで得られます。例えば次のようにします。

    convert2xml run-file

これにより、このモンテカルロ実行から抽出された情報を含む、そのタスクの XML ファイルが生成されます。

### 物理量の評価

コマンドラインでの評価用に、次のバイナリが用意されています：`dirloop_sse_evaluate`、`spinmc_evaluate`、`worm_evaluate`、`fulldiag_evaluate`、`qwl_evaluate`。このうち3つ（`dirloop_sse_evaluate`、`spinmc_evaluate`、`worm_evaluate`）は同じ構文を取ります。

    spinmc_evaluate [--write-xml] job.task1.out.xml [job.task2.out.xml ... ]

これにより、保存されているモンテカルロデータを用いて、シミュレーション自体では計算されなかった追加の物理量（比熱、圧縮率など）が計算されます。`--write-xml` を使うと、結果はすべて `.out.xml` ファイルに書き戻されます。このフラグを指定しない場合、結果は HDF5 ファイルにのみ書き出されます。
他の2つのバイナリの構文については、それぞれ `qwl_evaluate` と `fulldiag_evaluate` を使用している [MC-06 QWL](../../../../tutorials/mcs/mc06) と [ED-06 Full Diagonalization](../../../../tutorials/ed/ed06) のチュートリアルを参照してください。
評価プログラムの構造は比較的単純であり、そのような評価プログラムを自分で作成したり改変したりするのは難しくありません。以下の例は、あるボース・ハバード模型のシミュレーションについて、粒子数演算子 n と n2 の期待値を読み込み、圧縮率の期待値を計算して、それをチェックポイントに書き戻します。

    #include <alps/scheduler.h>
    #include <alps/alea.h>
 
    void evaluate(const boost::filesystem::path& p, std::ostream& out) {
        alps::ProcessList nowhere;
        alps::scheduler::MCSimulation sim(nowhere,p);
 
        // read in parameters
        alps::Parameters parms=sim.get_parameters();
        double beta=parms.defined("beta") ? static_cast<double>(parms["beta"]) : (1./static_cast<double>(parms["T"]));             
 
        // determine compressibility
        alps::RealObsevaluator n  = sim.get_measurements()["Particle number"];
        alps::RealObsevaluator n2 = sim.get_measurements()["Particle number^2"];
        alps::RealObsevaluator kappa= beta*(n2 - n*n);  
        kappa.rename("Compressibility");
 
        // write compressibility back to checkpoint  
        sim << kappa;
        sim.checkpoint(p);
    }
 
    int main(int argc, char** argv)
    {
        alps::scheduler::BasicFactory<alps::scheduler::MCSimulation,alps::scheduler::DummyMCRun> factory;
        alps::scheduler::init(factory);
        boost::filesystem::path p(argv[1]);
        evaluate(p,std::cout);
    }

ALPS では、Python を用いることで、データの解析・評価がはるかに簡単に行えることに注意してください（[Python の使用](../usepython) を参照）。この C++ の例は、C++ プログラム内で解析を行う必要がある場合にのみ使用してください。

ほとんどの ALPS アプリケーションに共通する入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。このページで扱っているスケジューラのオプション（`--time-limit`、`--checkpoint-time`、`--Tmin`／`--Tmax`、`--mpi`、`--Nmin`／`--Nmax`、`--write-xml`）は、パラメータファイルに書き込むものではなく、スケジューラ自体に渡すコマンドラインフラグである点に注意してください。このセクションの他の内容の概要については、[シミュレーションの実行](../..) を参照してください。



