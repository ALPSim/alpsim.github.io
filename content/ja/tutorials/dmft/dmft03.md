
---
title: DMFT-03 Interaction
math: true
toc: true
---

## 相互作用展開 CT-INT

CT-INT コードを用いてチュートリアル02と同じ計算を行ってみると勉強になります。このコードは（CT-HYB のようにハイブリダイゼーションを展開する代わりに）相互作用を展開します。対応する python スクリプトはチュートリアル02のものと非常によく似ており、ディレクトリ `tutorials/dmft-03-interaction` にあります。DMFT-02 のチュートリアルと同様に、2つの温度点のデータを生成する短縮版スクリプト [`tutorial3.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3.py)（実行時間の目安：約10分）と、6本すべての曲線を再現する完全版スクリプト [`tutorial3_long.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3_long.py)（約30分）のどちらかを選ぶことができます。結果の評価は、[DMFT-02 Hybridization](../dmft02) チュートリアルとまったく同じ方法で、スクリプト [`tutorial3eval.py`](https://github.com/ALPSim/ALPS/blob/daa73925b95389c0ec5e0d76ce592b56f3cd6738/tutorials/dmft-03-interaction/tutorial3eval.py) を使って行うことができます。
