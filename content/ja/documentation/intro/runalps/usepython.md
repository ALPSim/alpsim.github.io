
---
title: ALPS using Python
toc: true
weight: 3
---

## Running ALPS programs using Python

Python から ALPS を利用する方法を示すために、ここでは単純な古典モンテカルロシミュレーションを例にします：`spinmc` アプリケーションで解く、正方格子上の2次元強磁性 Ising 模型です。臨界温度に近づくと、局所的なスピン反転更新は臨界減速（critical slowing down）の影響を受けます――自己相関時間が発散し、連続する配置が統計的にほとんど独立でなくなります――そのため、代わりにクラスターアルゴリズム（`'UPDATE': "cluster"`）を用いて、揃ったスピンのクラスター全体を一度に反転させます。ここでは磁化 $|m|$ の温度依存性と、その Binder cumulant（臨界温度を精密に決定するための標準的な有限サイズ解析の道具）を計算します（この解析の詳細については [MC-07 Phase Transition](../../../../tutorials/mcs/mc07) を参照してください）。

## Launching Python

Python は、拡張モジュールをコンパイルしたときと**まったく同じ**バージョンの Python でしか使用できないという制約があります。ALPS をソースからビルドする場合（例えば Linux では必須です）、ALPS の設定時にどの Python インタプリタを使うかを指定できます。すると ALPS は

    alpspython

という名前のスクリプトを作成します。このスクリプトは、ALPS の拡張モジュールを見つけるために必要なパスを設定した上で、指定した Python インタプリタを呼び出します。

## Detailed instructions

### Importing the ALPS modules

Python を起動したら、必要なモジュールをインポートします。

    import pyalps
    import matplotlib.pyplot as plt
    import pyalps.plot

完全な Python スクリプトは、チュートリアルディレクトリの [`tutorials/intro-01-basics/tutorial-full.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-full.py) にあります。

### Preparing the input

入力を準備するために、シミュレーションのパラメータを含む Python の辞書のリストを作成します。

    parms = []
    for t in [1.5,2,2.5]:
        parms.append(
            { 
                'LATTICE'        : "square lattice", 
                'T'              : t,
                'J'              : 1,
                'THERMALIZATION' : 1000,
                'SWEEPS'         : 100000,
                'UPDATE'         : "cluster",
                'MODEL'          : "Ising",
                'L'              : 8
            }
        )

次に、ALPS シミュレーション用の入力ファイルを書き出します。

    input_file = pyalps.writeInputFiles('parm1',parms)

引数 `'parm1'` は、この関数にすべてのシミュレーションファイルの接頭辞として `parm1` を使うよう指示します。この関数はメインのシミュレーションファイルの名前（ここでは `parm1.in.xml`）を返します。

### Running the simulation

#### Running the simulation on a serial machine

シミュレーションを実行するには、`runApplication` 関数を呼び出すだけです。

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True)

パラメータ `writexml=True` は、すべての結果を XML ファイルにも書き出すよう ALPS に指示します。これにより I/O は遅くなりますが、出力 XML ファイルをウェブブラウザで開くだけで結果を確認できるため便利です。ただし、測定する物理量が多い場合、ファイルは非常に大きくなり、書き込みに時間がかかりすぎることがあります。

#### Running the simulation on a parallel machine

MPI を用いて並列マシン上でシミュレーションを実行するには、代わりに次のコマンドを呼び出します。

    pyalps.runApplication('spinmc',input_file,Tmin=5,writexml=True,MPI=4)

ここで `MPI` 引数は、起動するプロセス数を指定します。

### Loading the simulation results

#### Getting the result files

結果を読み込む前に、結果ファイルの一覧を取得する必要があります。ちょうど今作成したファイル（接頭辞 `parm1` で始まるもの）だけに注目すると、次のようにファイル一覧が得られます。

    result_files = pyalps.getResultFiles(prefix='parm1')
    print(result_files)

#### Loading the results

次に、何が測定されたかを知りたくなるかもしれません。そのためには、観測量のリストを読み込みます。

    print(pyalps.loadObservableList(result_files))

ここでは磁化の絶対値とその二乗を読み込むことにし、読み込んだ内容を表示します。

    data = pyalps.loadMeasurements(result_files,['|Magnetization|','Magnetization^2'])
    print(data)

出力される内容には、読み込まれた値が `y` に、そしてすべてのシミュレーションパラメータが `props` という辞書に含まれています。

### Plotting the results 

例えば |Magnetization| の温度依存性をプロットするために、`collectXY` を呼び出して |Magnetization| の値を `y` に、温度 `T` を `x` にまとめます。

    plotdata = pyalps.collectXY(data,'T','|Magnetization|')

#### Plotting in Python using `matplotlib`

続いて、`matplotlib` と `pyalps.plot` モジュールを使ってプロットします。

    plt.figure()
    pyalps.plot.plot(plotdata)
    plt.xlim(0,3)
    plt.ylim(0,1)
    plt.title('Ising model')
    plt.show()

#### Converting to other formats

データセットを、プレーンテキストや Grace、Gnuplot といった他のプロット形式に変換する関数も用意されています。

    print(pyalps.plot.convertToText(plotdata))
    print(pyalps.plot.makeGracePlot(plotdata))
    print(pyalps.plot.makeGnuplotPlot(plotdata))

### Evaluating data

結果に対する関数、例えば Binder cumulant 比 $\langle m^2 \rangle / \langle |m|\rangle ^2$ を簡単に評価できます。新しい `DataSet` を作成し、値を入れていきます。

    binder = pyalps.DataSet()
    binder.props = pyalps.dict_intersect([d[0].props for d in data])
    binder.x = [d[0].props['T'] for d in data]
    binder.y = [d[1].y[0]/(d[0].y[0]*d[0].y[0]) for d in data]
    print(binder)

式 `d[1].y[0]/(d[0].y[0]*d[0].y[0])` では、相関のある物理量に対して正しいモンテカルロ誤差を計算するために jackknife 解析が使われています。

最後に、もう1つプロットを作成します。

    plt.figure()
    pyalps.plot.plot(binder)
    plt.xlabel('T')
    plt.ylabel('Binder cumulant')
    plt.show()

## Complete example scripts

完全なスクリプトはファイル [`tutorials/intro-01-basics/tutorial-full.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-full.py) にあります。

以下では、さまざまな作業のためのより小さなスクリプトを紹介します。

### Running and plotting

- matplotlib で磁化のプロットを準備する：[`tutorials/intro-01-basics/tutorial-magnetization.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-magnetization.py)
- Grace で磁化のプロットを準備する：[`tutorials/intro-01-basics/tutorial-graceplot.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-graceplot.py)
- Gnuplot で磁化のプロットを準備する：[`tutorials/intro-01-basics/tutorial-gnuplot.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-gnuplot.py)
- 磁化をプレーンテキストで出力する：[`tutorials/intro-01-basics/tutorial-text.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-text.py)

### More complex evaluation

- Binder cumulant の計算はファイル [`tutorials/intro-01-basics/tutorial-binder.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-binder.py) にあります。

### Splitting into subtasks

準備・実行・評価の各作業は、サブタスクに分割することもできます。

- 入力ファイルの準備：[`tutorials/intro-01-basics/tutorial-prepareinput.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-prepareinput.py)
- シミュレーションの実行：[`tutorials/intro-01-basics/tutorial-runsimulation.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-runsimulation.py)
- 結果の評価：[`tutorials/intro-01-basics/tutorial-evaluate.py`](https://github.com/ALPSim/ALPS/blob/master/tutorials/intro-01-basics/tutorial-evaluate.py)

## More examples

各種関数の使用例や、より高度なアプリケーションについては、チュートリアルを参照してください。また、各関数の `__doc__` 属性を使ってドキュメントを参照することも忘れないでください。例えば次のようにします。

    print(pyalps.plot.plot.__doc__)

ほとんどの ALPS アプリケーションに共通する入力パラメータについては、[共通パラメータ](../../parameters) を参照してください。ここで示した Python の方法と同じ出力ファイルを生成するコマンドラインでの手順については、[コマンドラインの使用](../commandline) を参照してください。このセクションの他の内容の概要については、[シミュレーションの実行](../..) を参照してください。
