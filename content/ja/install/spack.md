
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
{{< callout type="info" >}}
現在、Spack の組み込みレシピでインストールされるのは ALPS 2.3.4-beta.2 です。ALPS 3.0.0 は [spack/spack-packages#6489](https://github.com/spack/spack-packages/pull/6489) がマージされた後に Spack から利用可能になります。それまでは、3.0.0 には[バイナリ](../binary)または[ソース](../source)からのインストールを使用してください。
{{< /callout >}}
ALPS を使用するには、パッケージをロードする必要があります。
```
spack load alps
```

### スーパーコンピュータクラスタでの Spack インストール
スーパーコンピュータクラスタに ALPS をインストールする必要がある場合は、ログインノードで上記のコマンドを実行するのではなく、バッチジョブを投入してジョブノード上でインストールすることをお勧めします。インストールには長時間かかることがあるため、ログインノードでインストールを行うとクラスタの他のユーザに影響を与える可能性があります。

以下のスーパーコンピュータクラスタでの ALPS のインストールに成功しています。[NCSA Delta (イリノイ州)](https://docs.ncsa.illinois.edu/systems/delta/en/latest/index.html)、[PSC Bridges (ピッツバーグ)](https://www.psc.edu/resources/bridges-2/user-guide/)、[Purdue Anvil](https://www.rcac.purdue.edu/anvil#docs)、[SDSC Expanse (サンディエゴ)](https://www.sdsc.edu/systems/expanse/user_guide.html)、[TACC Stampede3 (テキサス州)](https://docs.tacc.utexas.edu/hpc/stampede3/)。バッチジョブの投入方法については、それぞれのドキュメントを参照してください。

### トラブルシューティング

<details>
<summary><strong><code>spack: command not found</code> と表示される、または <code>spack</code> ディレクトリ内でしか Spack が動作しない</strong></summary>

新しいターミナルを開くたびに、`spack` ディレクトリへのパスを指定して Spack のシェル設定スクリプトを読み込む必要があります：
```
. /path/to/spack/share/spack/setup-env.sh
```
これを恒久的に有効にするには、この行をシェルの起動ファイル（例：`~/.zshrc` や `~/.bashrc`）に追加してください。

</details>

<details>
<summary><strong>Spack が使用する Python インタプリタの指定</strong></summary>

Spack は `PATH` 上で最初に見つかった `python3`（または `python`）を使用します。別のインタプリタを使用するには、環境変数 `SPACK_PYTHON` を設定してください（Spack は `PYTHON` 変数を参照しません）：
```
export SPACK_PYTHON=/path/to/python3
. spack/share/spack/setup-env.sh
spack python -c "import sys; print(sys.executable)"
```
最後のコマンドで、Spack が実際に使用しているインタプリタが表示されます。

</details>

<details>
<summary><strong>macOS での <code>SSL: CERTIFICATE_VERIFY_FAILED</code></strong></summary>

すべてのダウンロードが次のようなエラーで失敗する場合：
```
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate
```
Spack が [python.org](https://www.python.org) からインストールした Python（`/Library/Frameworks/Python.framework/` 以下）で動作している可能性が高いです。この Python は macOS のシステム証明書を使用しないため、Python のバージョンごとに一度、証明書バンドルをインストールする必要があります：
```
"/Applications/Python 3.x/Install Certificates.command"
```
`3.x` はお使いの Python のバージョン（例：`3.14`）に置き換えてください。または、macOS の証明書ストアを使用する Apple のシステム Python を Spack に使用させることもできます：
```
export SPACK_PYTHON=/usr/bin/python3
```

</details>

<details>
<summary><strong><code>AttributeError: module 'os' has no attribute 'O_PATH'</code> が発生する</strong></summary>

`os.O_PATH` は Linux にのみ存在します。2026 年 5 月の Spack 開発版はこれを無条件に使用していました（[spack/spack#52334](https://github.com/spack/spack/pull/52334)）。この問題は [spack/spack#52447](https://github.com/spack/spack/pull/52447) で修正されています。

- **macOS：** Python インタプリタを切り替えてもこのエラーは解決しません。Spack を v1.2.0 以降に更新してください（`spack` ディレクトリ内で `git pull` または `git checkout v1.2.2` を実行）。
- **Linux：** Spack を更新する（`spack` ディレクトリ内で `git pull` を実行する）か、`SPACK_PYTHON` を使って別の Python インタプリタで Spack を実行してください（上記参照）。

</details>

ここに記載されていない問題については、[GitHub](https://github.com/ALPSim/ALPS/issues) で検索するか、issue を作成してください。

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
