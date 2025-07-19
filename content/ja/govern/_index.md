---
title: ガバナンス
description: "ALPSのガバナンス体制"
toc: false
---

## ALPSのミッション

ALPSは、相関量子システムのシミュレーション向けソフトウェアを統合・配布することを目的としています。

現在、ALPSのガバナンス体制の再構築を進めています。今後の構造に関する作業はワークショップで実施され、こちらで発表されます。参加にご関心のある方は、現在のリーダーシップまでお知らせください。

## ALPSコミュニティ運営委員会

<br>

<style>
div.mycontainer {
  width:100%;
  overflow:auto;
}
div.mycontainer div {
  width: 33%;  
  float: left;
  display: inline-block;
  text-align: center;
}
h4 {
  display: inline-block;
}
</style>


<div class="mycontainer">

  <div>
    {{< figure src="feiguin.jpeg" width="150" height="150">}}
  </div>
  
  <div>
    {{< figure src="gull.jpeg" width="150" height="150">}}
  </div>
  
  <div>
    {{< figure src="scarola.jpeg" width="150" height="150">}}
  </div>
  
</div>

<div class="mycontainer">

  <div>
    <h4><a href="https://cos.northeastern.edu/people/adrian-feiguin/">Adrian Feiguin</a></h4>
    <h6>物理学教授<br>
    ノースイースタン大学
    </h6>
  </div>
  
  <div>
    <h4><a href="https://lsa.umich.edu/physics/people/faculty/egull.html">Emanuel Gull</a></h4>
    <h6>物理学教授<br>
    ミシガン大学
    </h6>
  </div>
  
  <div>
    <h4><a href="https://scarola.phys.vt.edu/">Vito Scarola</a></h4>
    <h6>物理学教授<br>
    バージニア工科大学
    </h6>
  </div>
  
</div>

<div class="mycontainer">
  <div>
    <p>
    <a href="mailto:a.feiguin@northeastern.edu">a.feiguin@northeastern.edu</a>
    </p>
  </div>
  <div>
    <p>
    <a href="mailto:egull@umich.edu">egull@umich.edu</a>
    </p>
  </div>
  <div>
    <p>
    <a href="mailto:scarola@vt.edu">scarola@vt.edu</a>
    </p>
  </div>
</div>


## ALPS外部諮問委員会

<br>
<div class="mycontainer">

  <div>
    {{< figure src="chamon150.png" width="150" height="150">}}
  </div>

  <div>
    {{< figure src="maestro150.png" width="150" height="150">}}
  </div>
  
  <div>
    {{< figure src="maier150.png" height="150">}}
  </div>
  
</div>

<div class="mycontainer">
  <div>
    <h4><a href="https://www.bu.edu/eng/profile/claudio-chamon/">Claudio Chamon</a></h4>
  </div>

  <div>
    <h4><a href="https://quantum.utk.edu/people/adrian-del-maestro-2/">Adrian Del Maestro</a></h4>
  </div>

  <div>
    <h4><a href="https://www.ornl.gov/staff-profile/thomas-maier">Thomas Maier</a></h4>
  </div>

</div>

<div class="mycontainer">
  <div>
    <h6>
    物理学教授 <br>
    ボストン大学
    </h6>
  </div>

  <div>
    <h6>教授<br>
    物理学・天文学科 および <br> 
    電気工学・コンピューター科学科 <br>
    テネシー大学<br>
    </h6>
  </div>

  <div>
    <h6>上級研究員・部門長<br>
    オークリッジ国立研究所<br>
    </h6>
  </div>

</div>


<div class="mycontainer">

  <div>
    {{< figure src="bostonu_logo_chamon150.png" width="100">}}
  </div>
  <div>
    {{< figure src="utk_logo_maestro.jpeg" width="150" height="150">}}
  </div>
  <div>
    {{< figure src="ornl_logo_maier.png" width="150" height="150">}}
  </div>
</div>

<br>

<div class="mycontainer">
  <div>
    {{< figure src="m_troyer150.png" width="150" height="150">}}
  </div>
</div>

<div class="mycontainer">

  <div>
    <h4><a href="https://www.microsoft.com/en-us/research/people/mtroyer/">Matthias Troyer</a></h4>
  </div>

</div>
<div class="mycontainer">

  <div>
    <h6>テクニカルフェロー兼量子担当副社長<br>
    マイクロソフト<br>
    </h6>
  </div>
  
</div>

<div class="mycontainer">
  <div>
    {{< figure src="microsoft_logo_troyer.png" width="150" height="150">}}
  </div>
  
</div>

## ALPSガバナンス文書

### 概要 

ALPSソフトウェアスイート（Applications and Libraries for Physics Simulations）は、凝縮系物理、量子コンピューティング、量子情報、関連分野向けのオープンソースアルゴリズムエコシステムを提供します。本プロジェクトは、保守可能かつ持続可能なALPSのオープンソースインフラとコミュニティ構築活動を通じて、科学コミュニティを支援します。
ALPSは[自律選出委員会](#alps-community-steering-committee)によって運営されています。ALPSリリースはオープンソースのMITライセンス下で提供されます。プロジェクト開発への参加については、[運営委員会メンバー](#alps-community-steering-committee)までメールでお問い合わせください。

### 役割と責任 

ALPSは各技術的役割に対して階層的な共有ガバナンス構造を採用しています。
開発者/貢献者コミュニティは、[GitHub](https://github.com/ALPSim/ALPS)を通じて課題を提出し、プルリクエストを作成し、プロジェクトに貢献します。
各シミュレーションコードには少なくとも1人のメンテナーが存在し、ALPSプロジェクトへの貢献を推進します。
彼らはコアメンテナーによって認定され、コアメンテナーはコミットメント要件を課し、コミュニティ課題に対応します。
運営委員会はプロジェクト全体の方向性を決定し、コードコミットメント要件を確立し、廃止決定を行います。
外部諮問委員会はコミュニティ関与の方向性とアプローチについて助言します。

#### メンテナー:

各コードには変更リクエストをGitHubで提出するメンテナグループがあります。メンテナグループはGitHubプルリクエストの作成とコード範囲の変更を担当します。各メンテナグループは1名以上のメンバーをコアメンテナーとして選出する責任があります。運営委員会がコミットメントの範囲を決定します。

#### コアメンテナー:
    
コアメンテナーには2つの主要な役割があります：1) コミュニティからの課題（バグ修正やプルリクエストなど）に対応します。2) メンテナーによる変更リクエストやプルリクエストを検証します。これには実行検証、コンパイル、バグチェックが含まれます。

#### 運営委員会:
    
[運営委員会](#alps-community-steering-committee)は、[外部諮問委員会](#alps-external-advisory-board)の助言を受けながらALPSプロジェクトの全体像を主導します。委員会の任務は以下の通りです：

- メンテナーとコアメンテナーの指名、承認、解任
- メンテナーが使用するコード、ライブラリ、依存関係のロードマップ確立
- 委員会と諮問委員会のメンバー選出と解任
- ALPSリリース論文の出版プロセス主導

#### 外部諮問委員会:

外部諮問委員会は以下を推奨します：

- ALPSプロジェクトの全般的な方向性
- コミュニティ成長と維持の方向性

### サポート 

- バグ報告や機能リクエストは、GitHub[リポジトリ](https://github.com/ALPSim/ALPS/issues)までお願いします。

- ALPSの使用に関するヘルプは、[Discord](https://discord.gg/JRNWnnva9g)のユーザーフォーラムをご利用ください。

- ALPSへの貢献については、[運営委員会](#alps-community-steering-committee)メンバーまでご連絡ください。

### 意思決定プロセス 

ALPSへの貢献と変更は合意形成モデルで行われます。変更提案はGitHubリポジトリに投稿されると、メンテナーとコアメンテナーの両方によってレビューされます。6週間以内にコメントがない場合、またはすべてのメンテナーが変更に同意した場合、変更は承認されます。論争のある提案の決定は運営委員会に上訴できます。

### 貢献プロセス

ALPSへの貢献を希望する開発者は、[運営委員会](#alps-community-steering-committee)メンバーに連絡し、オンボーディングについて協議します。貢献者とそのグループメンバーは、GitHubを使用してパッケージに統合するコードを提供することでALPSチームに参加します。コードはMITオープンソースライセンスでリリースされます。コミュニティとの交流は定期的な[ALPSワークショップ](https://alps.comp-phys.com/events/)を通じて行われます。

貢献者はALPSを維持するための時間的コミットメントを調整します。メンテナンスには既存コードの更新、ウェブサイトの支援、フォーラムヘプルリクエストへの対応、その他のALPSコミュニティメンテナンスタスクが含まれます。時間的コミットメントはGitHubとDiscordで監視されます。

ALPSリリースには発表論文が伴います。ALPSへの積極的な貢献者は共著者として追加されます。著者リストの決定は運営委員会が責任を負います。
