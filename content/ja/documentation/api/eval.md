
---
title: データの評価
linkTitle: 評価
math: true
toc: true
weight: 3
---


### DataSet

`*class* pyalps.DataSet(x=None, y=None, props=None)`

- DataSet クラスは、通常は XY 形式のデータの集まりを、シミュレーションへの入力パラメータなど、そのデータを記述するすべてのプロパティとともに格納します。

- メンバは次のとおりです。
   - x, y - データを保持します。DataSet を操作する多くの関数では、Numpy 配列のリストとして与えられることが想定されています。ただし、ユーザーが用意する関数では、データを別の形で表現してもかまいません。

   - props - データセットを記述するプロパティの辞書です。

### ツール

`pyalps.collectXY(sets, x, y, foreach=, []ignoreProperties=False)`
  DataSet オブジェクトのリストから指定したデータを収集します

- この関数は、プロットや評価の準備のために、DataSet オブジェクトのリストからデータを収集するのに使います。

- パラメータは次のとおりです。

   - sets: データセットのリスト
   - x: 収集結果の x 値として使うプロパティまたは測定量の名前
   - y: 収集結果の y 値として使うプロパティまたは測定量の名前
   - foreach: 結果をグループ化するために使うプロパティの、省略可能なリスト。指定したパラメータの値の組それぞれに対して、別々の DataSet オブジェクトが作成されます。
   - ignoreProperties: ignoreProperties=True と設定すると、collectXY() はプロパティを収集しません。
   
- この関数は DataSet オブジェクトのリストを返します。

`pyalps.groupSets(groups, for_each=[])`
  DataSet オブジェクトのリストを、リストのリストにグループ化します

- この関数は、for_ech 引数で与えたプロパティの値に従って、DataSet オブジェクトのリストをリストのリストにグループ化します。for_each で与えたプロパティの値が同じ DataSet オブジェクトどうしが、1 つのグループにまとめられます。

- パラメータは次のとおりです。
   - data: グループ化するデータ　for_each: データをグループ化する基準となるプロパティ

`pyalps.select(inp, condition)`

`pyalps.select_by_property(data, proplist)`

`pyalps.mergeDataSets(dsets)`

`pyalps.mergeMeasurements(measurements)`


### フィットのラッパー

`pyalps.fit_wrapper.Parameter()`

`pyalps.fit_wrapper.fit(self, function, parameters, y, x=None)`

### プロット

`pyalps.SetLabels(data, proplist)`

- ‘proplist’ で与えたプロパティに従ってラベルを設定します。

`pyalps.CycleColors(data, foreach, colors=['k', 'b', 'g', 'm', 'c', 'y'])`

- ‘foreach’ のプロパティに基づいて、DataSet を表示するのに使われる線やマーカーに色を順番に割り当てます。つまり、‘foreach’ のプロパティの値が同じ DataSet インスタンスには同じ色が割り当てられます。

`pyalps.CycleMarkers(data, foreach, markers=['s', 'o', '^', '>', 'v', '<', 'd', 'p', 'h', '+', 'x'])`

- ‘foreach’ のプロパティに基づいて、DataSet を表示するのに使われる線やマーカーにマーカーを順番に割り当てます。つまり、‘foreach’ のプロパティの値が同じ DataSet インスタンスには同じマーカーが割り当てられます。

