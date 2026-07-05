
---
title: DMFT-07 Hirsch-Fye
math: true
toc: true
---

## Hirsch Fye Code

まず、離散時間モンテカルロコードである [Hirsch Fye コード](https://link.aps.org/doi/10.1103/PhysRevLett.56.2521)を実行します。例として、[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図11を再現します。この6本の曲線は、相互作用 $U=3D/\sqrt{2}$ を持つベーテ格子上の半充填 Hubbard 模型が、冷却に伴って反強磁性相へと転移していく様子を示しています。

Hirsch Fye アルゴリズムは[こちら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)で解説されており、このレビュー論文はコードのオープンソース実装も提供しています。これまでに多くの改良が行われてきましたが（例えば Alvarez (2008) や [Nukala09](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.80.195111) を参照してください）、このアルゴリズムは系統的な離散化誤差を排除する[連続時間アルゴリズム](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.235123)に取って代わられました。

Hirsch Fye シミュレーションは、1反復あたり約20秒かかります。このシミュレーションを実行するための python スクリプトには、2つの温度のみでシミュレーションを実行する短縮版 [`tutorial7.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7.py)（5分かかります）と、6つの温度すべてを再現するバージョンである [`tutorial7_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7_long.py) があります。結果の評価には、[DMFT-02 Hybridization](../dmft02) チュートリアルで説明されているのと同じスクリプト `tutorial2eval.py` を使うか、あるいはスクリプト [`tutorial7eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-07-hirschfye/tutorial7eval.py) を使うことができます。

主なパラメータは、[DMFT-02 Hybridization](../dmft02) チュートリアルで説明されているものと同じです。

離散時間法であるため、HF は $\Delta\tau$ による離散化誤差の影響を受けます。パラメータの組を一つ選び、$N$ を徐々に大きくしながら実行してみてください。
