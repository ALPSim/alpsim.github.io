---
title: 我们的系统
description: "ALPS 系统介绍"
layout: alps-home 
toc: true  
---

ALPS 能够模拟多种存在于一维、二维和三维晶格系统中的粒子，包括：
- 含/不含外磁场的经典与量子自旋
- 通过现场库仑势或光晶格势相互作用的费米子与玻色子

<!-- 保留原始JavaScript和HTML代码 -->
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
  
  setInterval(nextImage, 3000); // 每3秒切换图片
  
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

<div style="text-align: center;">
  <h2>晶格图库</h2>
  <div style="display: flex; align-items: center; justify-content: center;">
    <button onclick="prevImage()" style="font-size: 24px; background: none; border: none; cursor: pointer;">
      <i class="fas fa-chevron-left"></i>
    </button>
    <img id="gallery-image" src="" alt="晶格图像" style="max-width: 90%; height: auto; margin: 10px;">
    <button onclick="nextImage()" style="font-size: 24px; background: none; border: none; cursor: pointer;">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>

---
