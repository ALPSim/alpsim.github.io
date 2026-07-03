---
title: 参与贡献 ALPS
description: "如何向 ALPS 项目贡献代码、文档和教程"
weight: 2
toc: true
---

ALPS 是一个开源项目，欢迎各个层次的贡献——从提交 bug 报告、修改教程，到贡献全新的仿真方法或库。本页介绍参与方式。完整的技术细节请参阅 ALPS 仓库中的 [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md)（英文）。

## 贡献方式

| 级别 | 内容 |
|---|---|
| **1 — 反馈** | 安装 ALPS、尝试教程，发现不清楚或有问题的地方时提交 Issue |
| **2 — 文档与教程** | 改进或扩展本网站的教程、修正文档错误、添加示例 |
| **3 — 维护** | 修复 bug、完善测试、更新依赖、在 Discord 上解答社区问题 |
| **4 — 新代码** | 贡献新的算法、库或仿真应用程序 |

无需从第一级开始——根据您的技能和兴趣，选择合适的切入点即可。

初次参与项目的学生，可参阅[学生参与指南](../onboard)，其中详细描述了各级别的内容以及加入合作的预期。

## 开始之前

对于**bug 报告、功能请求和文档修改**，您可以直接在 [GitHub](https://github.com/ALPSim/ALPS) 上提交 Issue 或 Pull Request，无需事先联系。

对于**新的仿真应用程序或库**（第 4 级），在开始大量工作之前，请先联系[治理委员会](../#alps-community-steering-committee)的成员。这有助于避免重复工作，并确保新代码符合 ALPS 的架构和维护模式。

如果不确定从哪里开始，欢迎在 [Discord](https://discord.gg/JRNWnnva9g) 发送消息——社区成员很乐意为您指引方向。

## 贡献流程

完整流程记录在 [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md) 中。简要步骤如下：

1. **Fork** [ALPS 仓库](https://github.com/ALPSim/ALPS)并在本地克隆。
2. 在做修改之前先**构建并运行测试**，确认在您的环境中一切正常。
3. 为您的修改**创建分支**（按惯例使用 `fix/`、`feat/` 或 `docs/` 前缀）。
4. **进行修改**，根据需要添加或更新测试。
5. 向 `master` 分支**提交 Pull Request**。请在模板中说明测试方法，以及仿真代码的结果如何与已知参考值进行了验证。
6. **响应 Review 意见**。核心维护者将审查您的 PR；获得所有人批准，或在六周内无异议，PR 即可合并。

## Pull Request 的评审标准

- 在所有平台（Linux 和 macOS）上通过 CI。
- 无新的编译器警告（C++ 代码需满足 `-Wall -Wextra`）。
- 新增或修改的行为有测试覆盖。
- 仿真结果已与已发表的参考文献或已知解析解进行核验。
- 提交信息描述清晰，使用祈使句式。

## 贡献认可

ALPS 的每次发布都会伴随一篇经同行评审的论文。**活跃贡献者将被添加为共同作者。** [治理委员会](../#alps-community-steering-committee)负责决定每次发布的作者名单，综合考量在代码、文档、教程、测试和社区支持方面的贡献。

持续进行文档和教程改进、bug 修复或新功能开发（第 2 级及以上）通常是获得共同作者资格考虑的门槛。

## 获取帮助

| 渠道 | 用途 |
|---|---|
| [Discord](https://discord.gg/JRNWnnva9g) | 提问、开发讨论、与社区交流 |
| [GitHub Issues](https://github.com/ALPSim/ALPS/issues) | Bug 报告、功能请求、代码相关具体问题 |
| [ALPS 研讨会](../../events) | 线上线下社区会议 |
| [治理委员会](../#alps-community-steering-committee) | 新仿真代码的入驻、大型贡献 |
