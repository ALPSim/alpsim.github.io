---
title: 対象システム
description: "ALPSについて"
layout: alps-home 
toc: true  
---

ALPSは、外部磁場の有無に関わらず古典的・量子的スピン系、サイト間クーロン相互作用や光学格子ポテンシャルを通じて相互作用するフェルミ粒子・ボース粒子など、1次元・2次元・3次元格子系に存在する多様な粒子のシミュレーションが可能です。

<!-- JavaScriptとHTMLコードはここに保持 -->
<script>
  const images = [
    "/figs/lattice1dspins.png",
    "/figs/lattice2dspins.png"
  ];

  let currentIndex = 0;

  function showImage(index) {
    const galleryImage = document.getElementById("gallery-image");
    galleryImage.src = images[index];
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  document.addEventListener("DOMContentLoaded", () => {
    showImage(currentIndex);
  });
  
  setInterval(nextImage, 3000); // 3秒ごとに画像切り替え
  
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

<div style="text-align: center;">
  <h2>格子構造ギャラリー</h2>
  <div style="display: flex; align-items: center; justify-content: center;">
    <button onclick="prevImage()" style="font-size: 24px; background: none; border: none; cursor: pointer;">
      <i class="fas fa-chevron-left"></i>
    </button>
    <img id="gallery-image" src="" alt="格子構造画像" style="max-width: 90%; height: auto; margin: 10px;">
    <button onclick="nextImage()" style="font-size: 24px; background: none; border: none; cursor: pointer;">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>

---
