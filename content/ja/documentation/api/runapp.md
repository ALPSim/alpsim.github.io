
---
title: アプリケーションの実行
math: true
toc: true
weight: 1
---


`pyalps.writeParameterFile(fname, parms)`

- この関数は、DMFT のような単純な ALPS アプリケーション用のテキスト入力ファイルを書き出します

- 引数は次のとおりです。

  - filename: 書き出すパラメータファイルの名前
  - parms: パラメータの辞書

`pyalps.writeInputFiles(fname, parms, baseseed=None)`

 - この関数は、ALPS 用の XML 入力ファイルを書き出します

 - パラメータは次のとおりです。
     - fname: 書き出される XML ファイルのベースとなるファイル名
     - parms: シミュレーションパラメータを含む辞書のリスト
     - baseseed: 乱数の種を与える省略可能なパラメータ。個々のシミュレーションの種はこの値から計算されます。デフォルト値は現在時刻から取られます。

 - この関数は、メインの XML 入力ファイルの名前を返します


`pyalps.runApplication(appname, parmfiles, T=None, Tmin=None, Tmax=None, writexml=False, MPI=None, mpirun='mpirun')`
  ALPS アプリケーションを実行します

- この関数は ALPS アプリケーションを実行します。
- パラメータは次のとおりです。

    - appname: アプリケーションの名前　parmfile: メインの XML 入力ファイルの名前　writexml: 省略可能なパラメータ。HDF5 ファイルに加えて、すべての結果を XML ファイルにも書き出す場合に True に設定します
    - T: MC シミュレーションの制限時間
    - Tmin: MC シミュレーションが終了したかどうかを確認する間隔の最小時間を指定する、省略可能なパラメータ
    - Tmax: MC シミュレーションが終了したかどうかを確認する間隔の最大時間を指定する、省略可能なパラメータ
    - MPI: MPI シミュレーションで使用するプロセス数を指定する、省略可能なパラメータ。このパラメータをデフォルト値 None のままにすると、MPI は使用されません。
    - mpirun: MPI アプリケーションの起動に使う実行ファイルの名前を与える、省略可能なパラメータ。デフォルトは ‘mpirun’ です

`pyalps.runDMFT(infiles, apppath='')`
  ALPS の DMFT アプリケーションを実行します

- ALPS の DMFT アプリケーションは、（まだ）標準的な ALPS の入力ファイルとスケジューラを使っていません。そのため、これを呼び出すための別の関数が用意されています。この関数は必須のパラメータを 1 つ取ります。単一の入力ファイル、または入力ファイルのリストです。省略可能なパラメータ apppath で、バイナリへのパスを設定できます。

`pyalps.evaluateLoop(infiles, appname='loop', write_xml=False)`
looper QMC アプリケーションの結果を評価します

- この関数は、looper アプリケーションの評価ツールを呼び出します。さらに、評価された結果はファイルに書き戻されます。結果ファイルのリストに加えて、省略可能な引数を 1 つ取ります。

    - write_xml: この省略可能な引数を True に設定すると、結果が XML ファイルにも書き出されます

`pyalps.evaluateSpinMC(infiles, appname='spinmc_evaluate', write_xml=False)`
`spinmc` アプリケーションの結果を評価します

- この関数は、spinmc アプリケーションの評価ツールを呼び出します。さらに、評価された結果はファイルに書き戻されます。結果ファイルのリストに加えて、省略可能な引数を 1 つ取ります。

    - write_xml: この省略可能な引数を True に設定すると、結果が XML ファイルにも書き出されます

`pyalps.evaluateQWL(infiles, appname='qwl_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None)`
量子 Wang-Landau アプリケーションの結果を評価します

- この関数は、量子 Wang-Landau アプリケーションの評価ツールを呼び出します。結果ファイルのリストに加えて、次の引数を取ります。
   - T_MIN: 物理量を評価する温度範囲の下端
   - T_MAX: 物理量を評価する温度範囲の上端
   - DELTA_T: T_MIN と T_MAX の間で使用する温度の刻み幅

- この関数は、各入力ファイルについて評価されたさまざまなプロパティに対する、DataSet オブジェクトのリストのリストを返します。

`pyalps.evaluateFulldiagVersusT(infiles, appname='fulldiag_evaluate', DELTA_T=None, T_MIN=None, T_MAX=None, H=None)`
`fulldiag` アプリケーションの結果を温度の関数として評価します

- この関数は、`fulldiag` アプリケーションの評価ツールを呼び出し、いくつかの物理量を温度の関数として評価します。結果ファイルのリストに加えて、次の引数を取ります。
   - T_MIN: 物理量を評価する温度範囲の下端
   - T_MAX: 物理量を評価する温度範囲の上端
   - DELTA_T: T_MIN と T_MAX の間で使用する温度の刻み幅
   - H: （省略可能）すべてのデータを評価する磁場

- この関数は、各入力ファイルについて評価されたさまざまなプロパティに対する、DataSet オブジェクトのリストのリストを返します。

`pyalps.evaluateFulldiagVersusH(infiles, appname='fulldiag_evaluate', DELTA_H=None, H_MIN=None, H_MAX=None, T=None)`
`fulldiag` アプリケーションの結果を磁場 h の関数として評価します

- この関数は、fulldiag アプリケーションの評価ツールを呼び出し、いくつかの物理量を磁場の関数として評価します。結果ファイルのリストに加えて、次の引数を取ります。
   - H_MIN: 物理量を評価する磁場範囲の下端
   - H_MAX: 物理量を評価する温度範囲の上端
   - DELTA_H: H_MIN と H_MAX の間で使用する磁場の刻み幅
   - T: すべてのデータを評価する温度

- この関数は、各入力ファイルについて評価されたさまざまなプロパティに対する、DataSet オブジェクトのリストのリストを返します。

