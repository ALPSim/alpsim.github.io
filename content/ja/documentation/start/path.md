---
title: パスの設定
description: "ALPSの使用方法"
weight: 3
---

## バイナリインストールにおける実行ファイルのパス設定

バイナリインストールで`pyalps`のインストールが成功したら、`python`にインポートして使用を開始できます。ただし、システムが`python`コマンドのパスを認識していない可能性があります。以下に、Macシステムで`.bash_profile`ファイルに正しいパスを設定する例を示します。Linuxシステムの場合は、対応するファイルとして`.bashrc`を使用します。

### ターミナルで`ls`コマンドを使用して`python`のインストールディレクトリを確認

通常、以下のようなディレクトリにインストールされています：
```
ls /Library/Frameworks/Python.framework/Versions/3.12
```

`bin`ディレクトリ内には`python3`、`pip3`、その他のバイナリファイルがあります。ターミナルから通常の`python`や`pip`コマンドでこれらのバイナリを実行するには、システムにバイナリのパスを知らせ、コマンドのエイリアスを設定する必要があります。

### `.bash_profile`ファイルの検索または作成

- ホームディレクトリで`ls -a`を実行、または任意のディレクトリから`ls -a ~`を実行

- `vim`エディタで`.bash_profile`を編集または作成：
  `vi ~/.bash_profile`

- `i`キーを押して編集モードに切り替え

- バイナリパスをファイルに追加：
`export PATH="$PATH:/Library/Frameworks/Python.framework/Versions/3.12/bin"`

- コマンドのエイリアスを作成：
`alias python="python3"`
`alias pip="pip3"`

- 変更を保存：
`esc`キーを押した後、`:x`と入力。これで変更が保存され、`vim`が終了します。

### バイナリのパスとエイリアスをシステムに反映
ターミナルで以下を入力：`source ~/.bash_profile`

これで任意の`Python`ファイルを実行できるようになります。`pyalps`ライブラリは通常、以下のディレクトリにインストールされます：

`/Library/Frameworks/Python.framework/Versions/3.12/lib/python3.12/site-packages` 

上記または類似のディレクトリで`ls`を使用し、パッケージが正しくインストールされていることを確認してください。

## ソースインストールにおける実行ファイルのパス設定
ALPSをソースからインストールした場合、プログラムの実行ファイルはインストールディレクトリの/binフォルダに配置されます。以下のパスをMacの.bash_profileまたはLinuxの.bashrcに設定する必要があります。

`export PATH="$PATH:<ALPSのインストールディレクトリ>/bin"`

