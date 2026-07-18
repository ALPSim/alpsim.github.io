
---
title: ALPS 模型定义
toc: true
weight: 5
---

作为 ALPS 项目的一部分，我们需要用一种与运行模型的格子无关的通用 XML 格式来描述量子格点模型（格子部分参见[格子定义](../latticehowtos)）。本节将分阶段建立起这套格式：从模型库文件及其整体的 `<MODEL>`/`<SITEBASIS>`/`<BASIS>`/`<HAMILTONIAN>` 结构开始，依次讲解单个格点的基、整个格子的基，以及由它们构造出的量子算符和哈密顿量项。

## [简介](intro)

概述 ALPS 模型库文件（`lib/xml/models.xml`）、其内置的模型（自旋、玻色子/费米子 Hubbard 模型、t-J 模型、Kondo 晶格模型等），列出各模型参数的说明表并给出原始论文的引用，并介绍用于定义自定义模型的 `<MODEL>`/`<SITEBASIS>`/`<BASIS>`/`<HAMILTONIAN>` 四段式结构。

## [格点基](sitebasis)

如何用一个或多个 `<QUANTUMNUMBER>` 元素描述单个格点的希尔伯特空间，包括费米型与玻色型量子数的区别、参数化的取值范围与默认值，以及像 t-J 模型这样存在若干等价量子数选择的模型。

## [格子基](latticebasis)

如何用 `<BASIS>` 将单格点基组合成整个格子的基，涵盖每个晶胞包含多个格点的格子（包括用于按类型设置参数的 `#` 通配符简写），以及如何用 `<CONSTRAINT>` 对求和后的量子数（例如总 `Sz`）限制基的取值范围。

## [量子算符](operators)

如何定义构造哈密顿量所用的算符：带有显式矩阵元和量子数 `<CHANGE>` 的简单格点算符（例如 `Splus`、`bdag`、`cdag_up`），由更简单的算符组合而成的复合 `<SITEOPERATOR>`（例如 `Sx`），以及双格点的 `<BONDOPERATOR>`（例如 `exchange`、`fermion_hop`）。

## [哈密顿量描述](hamiltonian)

如何用 `<PARAMETER>` 默认值、一个 `<BASIS>` 引用以及 `<SITETERM>`/`<BONDTERM>` 元素组装出一个 `<HAMILTONIAN>` —— 包括如何通过显式的 `type` 属性或 `#` 通配符实现依赖类型的耦合。
