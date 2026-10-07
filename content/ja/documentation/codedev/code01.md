
---
title: Code-01 Python
math: true
toc: true
weight: 2
---

## Python で ALPS を使い始める

このチュートリアルでは、python-ALPS を使うと、わずか数行のコードでシミュレーションを書けることを示します。物理シミュレーションの世界における「hello world」の例として、局所更新を用いた古典 2 次元イジングモデルのモンテカルロシミュレーションを行います。モンテカルロシミュレーションの典型的な構造を示すスケルトンコードがファイル `ising-skeleton.py` に用意されており、以下で順を追って説明します。

まず、必要な Python モジュールをインポートします。

    import math
    import pyalps
    import pyalps.alea as alpsalea
    import pyalps.pytools as alpstools

はじめに Simulation クラスを実装します。このクラスには、シミュレーションの初期化、実行、そして測定結果の HDF5 ファイルへの保存を行うメソッドが含まれます。

    class Simulation:
    # Seed random number generator: self.rng() will give a random float from the interval [0,1)
    rng = alpstools.rng(42)
   
   def __init__(self,beta,L):
       self.L = L
       self.beta = beta
       
       # Init exponential map
       self.exp_table = dict()
       for E in range(-4,5,2): 
         self.exp_table[E] = math.exp(2*beta*E)
       
       # Init random spin configuration
       self.spins = [ [2*self.randint(2)-1 for j in range(L)] for i in range(L) ]
       
       # Init observables
       self.energy = alpsalea.RealObservable('E')
       self.magnetization = alpsalea.RealObservable('m')
       self.abs_magnetization = alpsalea.RealObservable('|m|')

`__init__` メソッドは、この Simulation クラスのオブジェクトがどのように生成されるかを定義します。引数として格子サイズ $L$ と逆温度 \beta が渡されます。これらのパラメータをもとに、取りうるボルツマン重みを求め、イジングスピンの正方格子をランダムな配置で初期化します。さらに、測定する観測量も初期化します。ここでは python-ALPS フレームワークを利用し、観測量の評価を ALPS の alea ライブラリに任せています。クラス内では乱数生成器の初期化とシードの設定も行っています。エンジンとしてはメルセンヌ・ツイスタ MT19937 を使用しています。その長い周期と統計的性質から、モンテカルロシミュレーションに適した選択です。

    def save(self, filename):
       pyalps.save_parameters(filename, {'L':self.L, 'BETA':self.beta, 'SWEEPS':self.n, 'THERMALIZATION':self.ntherm})
       self.abs_magnetization.save(filename)
       self.energy.save(filename)
       self.magnetization.save(filename)
       
save メソッドは、シミュレーションのパラメータと結果を HDF5 ファイルに保存します。

    def run(self,ntherm,n):
       # Thermalize for ntherm steps
       self.n = n
       self.ntherm = ntherm
       while ntherm > 0:
           self.step()
           ntherm = ntherm-1
       # Run n steps
       while n > 0:
           self.step()
           self.measure()
           n = n-1
       # Print observables
       print '|m|:\t', self.abs_magnetization.mean, '+-', self.abs_magnetization.error, ',\t tau =', self.abs_magnetization.tau
       print 'E:\t', self.energy.mean, '+-', self.energy.error, ',\t tau =', self.energy.tau
       print 'm:\t', self.magnetization.mean, '+-', self.magnetization.error, ',\t tau =', self.magnetization.tau

`run` メソッドは、step ルーチンで定義されたモンテカルロ更新と、measure 関数による観測量の測定を管理します。系が熱化している間は測定を行いません。すべてのステップが終わると、観測量の平均値、誤差、自己相関時間を出力します。

    def step(self):
        for s in range(self.L*self.L):
            # Pick random site k=(i,j)
            ...
            # Measure local energy e = -s_k * sum_{l nn k} s_l
            ...        
            # Flip s_k with probability exp(2 beta e)
            ...

モンテカルロスイープは `step` メソッドで行われます。メトロポリス法では、スピンをランダムに 1 つ選び、確率 $p_{accept} = min(1,e^{-\beta \Delta E})$ で反転させます。ここで $\Delta E$ は、元の配置と提案された配置とのエネルギー差です。この手続きを $L^2$ 回繰り返します。メトロポリス法の実装は演習として残しておきます。以下で定義する `randint` 関数を利用できます。

    def randint(self,max):
       return int(max*self.rng())

選んだ観測量の測定は、メソッド `measure` に実装します。

    def measure(self):
        E = 0.    # energy
        M = 0.    # magnetization
        for i in range(self.L):
            for j in range(self.L):
                E -= ...
                M += ...
        # Add sample to observables
        self.energy << E/(self.L*self.L)
        self.magnetization << M/(self.L*self.L)
        self.abs_magnetization << abs(M)/(self.L*self.L)

与えられたスピン配置に対してエネルギーと磁化の値を求め、ALPS の観測量に追加します。この実装も演習として残しておきます。

観測量の測定とメトロポリス更新の実装が完成したら、Python インタプリタ `alpspython` を使ってシミュレーションを実行できます。この例では、$\beta = 1/k_B T$ のさまざまな値についてスキャンを行います。「main」プログラムを以下に示します。

    L = 4    # Linear lattice size
    N = 5000    # of simulation steps
    print '# L:', L, 'N:', N
    # Scan beta range [0,1] in steps of 0.1
    for beta in [0.,.1,.2,.3,.4,.5,.6,.7,.8,.9,1.]:
        print '-----------'
        print 'beta =', beta
        sim = Simulation(beta,L)
        sim.run(N/2,N)
        sim.save('ising.'+str(beta)+'.h5')

python-ALPS の便利な点は、例えば $U = \langle A \rangle/\langle B\rangle$ のような形の複合観測量を評価すると、ジャックナイフ解析が行われ、平均値と誤差が自動的に正しく評価されることです。例として、イジングシミュレーションを拡張して $m^2$ と $m^4$ の測定を追加し、そこからビンダーキュムラント $U_4=\langle m^4\rangle /\langle m^2\rangle^2$ を求めます。ビンダーキュムラントは通常、有限サイズスケーリングによって臨界温度を決定するために使われるので、$L=6,8$ についてもシミュレーションを行います。

これら 2 つの観測量を追加で実装し、シミュレーションを実行できたものとして、まずデータを読み込み、各系のサイズ $L$ について 2 つの観測量 $m^2$ と $m^4$ を逆温度 $\beta$ の関数として格納します。

    data = pyalps.loadMeasurements(pyalps.getResultFiles(pattern='ising.L*'),['m^2', 'm^4'])
    m2=pyalps.collectXY(data,x='BETA',y='m^2',foreach=['L'])
    m4=pyalps.collectXY(data,x='BETA',y='m^4',foreach=['L'])

これでビンダーキュムラントを計算できます。結果はデータセットのリストに格納します。

    u=[]
    for i in range(len(m2)):
        d = pyalps.DataSet()
        d.propsylabel='U4'
        d.props = m2[i].props
        d.x= m2[i].x
        d.y = m4[i].y/m2[i].y/m2[i].y
        u.append(d)

ビンダーキュムラントは次のコマンドでプロットできます。

    import pyalps.plot as plt 
    plt.figure()
    plt.plot(u)
    plt.xlabel('Inverse Temperature $\beta$')
    plt.ylabel('Binder Cumulant U4 $g$')
    plt.title('2D Ising model')
    plt.legend()
    plt.show()

何が観察できるでしょうか？ 相転移や有限サイズスケーリングの手法についてさらに学びたい場合は、チュートリアル [MC-07 イジングモデルの相転移](../../../tutorials/mcs/mc07) を参照してください。

