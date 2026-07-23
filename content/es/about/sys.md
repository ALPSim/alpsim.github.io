---
title: Nuestros Sistemas
description: "Acerca de ALPS"
toc: true
---

ALPS puede simular una amplia variedad de partículas presentes en sistemas de red 1D, 2D y 3D, incluyendo espines clásicos y cuánticos con o sin campos magnéticos externos, así como partículas fermiónicas y bosónicas que interactúan mediante potenciales de Coulomb en el mismo sitio o potenciales de red óptica.

<!-- Paste the JavaScript and HTML code here -->
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
  
  setInterval(nextImage, 3000); // Change image every 3 seconds
  
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

<div style="text-align: center;">
  <h2>Galería de Redes</h2>
  <div style="display: flex; align-items: center; justify-content: center;">
    <button onclick="prevImage()" style="font-size: 24px; background: none; border: none; cursor: pointer;">
      <i class="fas fa-chevron-left"></i>
    </button>
    <img id="gallery-image" src="" alt="Imagen de red" style="max-width: 90%; height: auto; margin: 10px;">
    <button onclick="nextImage()" style="font-size: 24px; background: none; border: none; cursor: pointer;">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>

---

