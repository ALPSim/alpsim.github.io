
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

### トラブルシューティング
<details>
<summary><strong> Boost </strong> </summary>

Spack の Boost パッケージでは、そのバリアント「cxxstd」のデフォルト値は「11」です。これは、C++ 標準に「14」を必要とする ALPS の要件と一致しません。以下の場所の `package.py` でこのデフォルト値を編集できます：

```
~/.spack/package_repos/fncqgg4/repos/spack_repo/builtin/packages/boost/package.py
```
または、パッケージのデフォルト値を変更せずに、コマンドラインでバリアント値を設定することもできます：
```
spack install alps ^boost@1.87.0 cxxstd=14
```
これにより、Boost ライブラリも C++14 標準でコンパイルされます。

</details>




