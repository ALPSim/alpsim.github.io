
---
title: Spack パッケージを使用した Mac/Linux への ALPS インストール
description: "ALPS Spack インストール"
weight: 3
toc: true
cascade:
    type: docs
---

### Spack インストール
ALPS の並列バージョンを使用する予定がある場合、またはスーパーコンピュータ環境で ALPS を実行する場合、[ソースインストール](../source) に加えて、[Spack パッケージ管理ツール](https://packages.spack.io) を通じてインストールすることもできます。[Spack での ALPS パッケージの詳細](https://packages.spack.io/package.html?name=alps) と [Spack ドキュメント](https://spack.readthedocs.io/en/latest/index.html) を参照することをお勧めします。

Spack は ALPS の依存関係を自動的に判断し、ALPS が必要とする正しいバージョンをインストールします。また、インストールは各ユーザーのホームディレクトリ内で個別に行われるため、同じコンピュータクラスタ内の他のユーザーに影響を与えることはありません。 

### インストール手順

まず、Spack を GitHub リポジトリからクローンする必要があります：
```
git clone --depth=2 https://github.com/spack/spack.git
```
これにより、spack というディレクトリが作成されます。使用しているシェルに適したスクリプトを読み込んでください。

bash、zsh、および sh ユーザー向け：
```
. spack/share/spack/setup-env.sh
```
csh および tcsh ユーザー向け：
```
source spack/share/spack/setup-env.csh
```

次に、Spack はコンピュータ内の利用可能なすべてのコンパイラを見つける必要があります：
```
spack compiler find
```
このコマンドにより、Spack はシステム内のすべての利用可能なコンパイラを検出し、ホームディレクトリ内の隠しディレクトリ .spack の下に packages.yaml ファイルを作成します。このファイルは以下のコマンドで表示・編集できます：
```
spack config edit packages
```
あるいは、以下のコマンドで利用可能なコンパイラを表示することもできます：
```
spack compilers
```
必要な最低コンパイラバージョンは `gcc@10.5.0` および `clang@13.0.1` です。

Spack 内の ALPS 情報ページを確認してみましょう：
```
spack info alps
```
これは ALPS のパッケージ依存関係を表示します。関連するすべてのパッケージは、Spack のパッケージ管理システムを通じて自動的にインストールされます。

最後に、ALPS をインストールしましょう！
```
spack install alps
```
ALPS を使用するには、パッケージをロードする必要があります。
```
spack load alps
```

### スーパーコンピュータクラスタでの Spack インストール
スーパーコンピュータクラスタに ALPS をインストールする必要がある場合は、ログインノードで上記のコマンドを実行するのではなく、バッチジョブを投入してジョブノード上でインストールすることをお勧めします。インストールには長時間かかることがあるため、ログインノードでインストールを行うとクラスタの他のユーザに影響を与える可能性があります。

以下のスーパーコンピュータクラスタでの ALPS のインストールに成功しています。[NCSA Delta (イリノイ州)](https://docs.ncsa.illinois.edu/systems/delta/en/latest/index.html)、[PSC Bridges (ピッツバーグ)](https://www.psc.edu/resources/bridges-2/user-guide/)、[Purdue Anvil](https://www.rcac.purdue.edu/anvil#docs)、[SDSC Expanse (サンディエゴ)](https://www.sdsc.edu/systems/expanse/user_guide.html)、[TACC Stampede3 (テキサス州)](https://docs.tacc.utexas.edu/hpc/stampede3/)。バッチジョブの投入方法については、それぞれのドキュメントを参照してください。以下は、NCSA Delta スーパーコンピュータクラスタで ALPS をインストールするために使用したバッチスクリプトのサンプルです。
```
#!/bin/bash
#SBATCH --mem=16g
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1    # <- OMP_NUM_THREADS に合わせる
#SBATCH --partition=cpu      # <- または gpuA100x4 gpuA40x4 gpuA100x8 gpuMI100x8 のいずれか
#SBATCH --account=bdhb-delta-cpu    # <- "accounts" コマンドで返される "Project" に合わせる
#SBATCH --job-name=installALPS
#SBATCH --time=05:00:00      # ジョブの実行時間 (hh:mm:ss)
#SBATCH --constraint="scratch"
#SBATCH -e slurm-%j.err
#SBATCH -o slurm-%j.out
### GPU オプション ###
##SBATCH --gpus-per-node=2
##SBATCH --gpu-bind=none     # <- または closest
##SBATCH --mail-user=you@yourinstitution.edu
##SBATCH --mail-type="BEGIN,END" その他のメールオプションについては sbatch または srun のマニュアルページを参照

. spack/share/spack/setup-env.sh

spack install alps
```

## インストール手順ビデオ

### WSL での Spack による ALPS (v2.3.3) のインストール
<br>

{{< youtube id="TD7PuiJKq5U" >}}


### WSL での Spack による ALPS (v2.3.4) のインストール
<br>

{{< youtube id="CJmRIpAi02g" >}}

### スーパーコンピュータクラスタ上での Spack による ALPS (v2.3.4) のインストール
<br>

{{< youtube id="yTn7ubU4bqE" >}}
