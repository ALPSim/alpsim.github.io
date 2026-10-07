
---
title: Code-02 C++
math: true
toc: true
weight: 3
---

このチュートリアルでは、観測量の評価に ALPS の alea ライブラリを用いて、C++ でモンテカルロシミュレーションを書く方法を示します。第 2 段階として、測定結果を標準的な HDF5 ファイル形式で書き出します。これにより、その後のデータ解析やプロットに ALPS スイートのツールを使えるようになります。

簡単な例として、局所更新を用いた古典 2 次元イジングモデルのシミュレーションを書きます。ファイル `ising-skeleton.cpp` には、必要なインフラがすべて揃ったスケルトンコードが含まれています。まず必要なヘッダをすべてインクルードし、次に乱数生成器と 3 つの `alps::RealObservable` オブジェクトを初期化します。続いて、イジングスピンの正方格子を用意します。また、メトロポリス更新に使える確率の表も用意されています。インターフェースは、前回の[チュートリアル](../../codedev/code01)で実装した Python スクリプトと同じです。

今回も、メソッド `step()` と `measure()` を完成させるのが課題です。`step()` は格子からランダムにスピンを 1 つ選び、メトロポリス確率 $p_{accept} = min(1,e^{-\beta \Delta E})$ でそれを反転させます。ここで $\Delta E$ はスピン反転によって生じるエネルギー変化です。`measure()` はスピン配置のエネルギーと磁化を求め、このサンプルを観測量オブジェクトに追加します。

省略記号をすべてコードに置き換えたら、この `Makefile` でシミュレーションをコンパイルできます。`Makefile` を `.cpp` ファイルと同じディレクトリに保存し、（環境変数 ALPS_ROOT をまだ設定していない場合は）2 行目を ALPS のインストール先を指すように編集してから、`make` と入力します。これにより実行ファイル `ising` が生成されます。これを実行すると、$\beta = 1/k_B T$ のさまざまな値についてのスキャンが行われます。

前回のチュートリアルで作成したビンダーキュムラントの Python スクリプトは、まったく同じように再利用できます。

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

そして、次のコマンドでビンダーキュムラントをプロットします。

    plt.figure()
    pyalps.pyplot.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.show()
