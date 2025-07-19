---
title: ALPSの入手方法
description: "ALPSの使用方法"
weight: 2
---

`ALPS`を使用する最も簡単な方法は、`pypi.org`からプリビルド済みの`Python`パッケージをインストールすることです：

```ShellSession
$ pip install pyalps
```
これにより、PythonスクリプトやJupyterノートブックでインポート可能なALPS Pythonパッケージがインストールされます。

---
または、以下の手順に従ってソースからALPSをビルドすることもできます：

  ```ShellSession
  $ git clone https://github.com/alpsim/ALPS alps-src
  $ cmake -S alps-src -B alps-build                      \
         -DCMAKE_INSTALL_PREFIX=</path/to/install/dir>   \
         -DCMAKE_CXX_FLAGS="-DBOOST_NO_AUTO_PTR          \
         -DBOOST_TIMER_ENABLE_DEPRECATED                 \
         -DBOOST_FILESYSTEM_NO_CXX20_ATOMIC_REF"
  $ cmake --build alps-build -j 8
  $ cmake --build alps-build -t test
  $ cmake --install alps-build
  ```
この操作により、指定したパスにALPSのダウンロード、ビルド、テスト、インストールが行われます。
より詳細な手順やトラブルシューティングについては、[インストールガイド](/documentation/install)をご覧ください。

