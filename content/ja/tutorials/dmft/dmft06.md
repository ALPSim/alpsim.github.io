
---
title: DMFT-06 Paramagnet
math: true
toc: true
---

## Paramagnetic metal and extrapolation errors

この例では、常磁性の自己無撞着計算を用いて、ベーテ格子上で相互作用 $U=3D/\sqrt{2}$、温度 $\beta =32 \sqrt{2}/D$ の Hubbard 模型をシミュレーションします。自己エネルギーを計算し、[Georges らによる DMFT のレビュー論文](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図15と比較します。この図には、同じ系についての Hirsch-Fye 法と厳密対角化の結果が示されています。Hirsch-Fye アルゴリズムとは異なり、2つの連続時間量子モンテカルロアルゴリズムである CT-HYB と CT-INT は離散化誤差を持たず、厳密対角化の結果を再現します。

パラメータファイルと python スクリプトは、ALPS のインストールディレクトリ内の `tutorials/dmft-06-paramagnet` ディレクトリのサブディレクトリ `hyb` と `int` にあります。以下を実行することでシミュレーションを実行できます（ハイブリダイゼーション展開版の場合）。

```
python tutorial6a.py
```

および（相互作用展開版の場合）

```
python tutorial6b.py
```

各 DMFT 反復 i において、自己エネルギーはファイル `selfenergy_i` に書き出されます。収束した自己エネルギーをプロットし、[Georges ら](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.13)の図15と結果を比較してください。あるいは、[DMFT-02 Hybridization](../dmft02) チュートリアルで行ったのと同様に、この作業のための python スクリプトを使用することもできます。

警告：1台のワークステーションで実行するとかなりの時間がかかります。非常に高い精度が不要な場合は、2回の実行の合計時間を約 $2\times 24$ 分に短縮することができます。
