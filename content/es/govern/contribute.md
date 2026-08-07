---
title: Contribuir a ALPS
description: "Cómo contribuir con código, documentación y tutoriales al proyecto ALPS"
weight: 2
toc: true
---

ALPS es un proyecto de código abierto y da la bienvenida a contribuciones en todos los niveles — desde un reporte de bug o la corrección de un tutorial hasta un nuevo método de simulación o biblioteca. Esta página describe cómo involucrarte. Los detalles técnicos completos están en [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md) en el repositorio de ALPS.

## Formas de contribuir

| Nivel | Cómo se ve esto |
|---|---|
| **1 — Retroalimentación** | Instala ALPS, prueba un tutorial, abre un issue cuando algo no esté claro o no funcione |
| **2 — Documentación y tutoriales** | Mejora o amplía los tutoriales de este sitio web, corrige errores de documentación, añade ejemplos |
| **3 — Mantenimiento** | Corrige bugs, mejora las pruebas, actualiza dependencias, responde preguntas de la comunidad en Discord |
| **4 — Código nuevo** | Contribuye con un nuevo algoritmo, biblioteca o aplicación de simulación |

No necesitas empezar desde abajo — únete donde tus habilidades e intereses encajen mejor.

Los estudiantes nuevos en el proyecto también pueden querer leer la [Declaración de Incorporación para Estudiantes](../onboard), que describe cada nivel con más detalle y explica qué esperar de la colaboración.

## Antes de empezar

Para **reportes de bugs, solicitudes de funcionalidades y correcciones de documentación**, puedes abrir un issue o pull request directamente en [GitHub](https://github.com/ALPSim/ALPS) sin necesidad de contacto previo.

Para **nuevas aplicaciones o bibliotecas de simulación** (Nivel 4), por favor contacta a un miembro del [Consejo Directivo](../#alps-community-steering-committee) antes de comenzar un trabajo significativo. Esto evita la duplicación de esfuerzos y asegura que el nuevo código encaje en la arquitectura y el modelo de mantenimiento de ALPS.

Si no estás seguro de por dónde empezar, deja un mensaje en [Discord](https://discord.gg/JRNWnnva9g) — la comunidad es amigable y estará encantada de orientarte en la dirección correcta.

## El flujo de trabajo de contribución

El flujo de trabajo completo está documentado en [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md). En resumen:

1. **Haz un fork** del [repositorio de ALPS](https://github.com/ALPSim/ALPS) y clona tu fork localmente.
2. **Compila y prueba** para confirmar que todo funciona en tu máquina antes de hacer cambios.
3. **Crea una rama** para tu cambio (prefijo `fix/`, `feat/` o `docs/` por convención).
4. **Haz tu cambio**, añadiendo o actualizando pruebas según corresponda.
5. **Abre un pull request** contra la rama `master`. Completa la plantilla del pull request — en particular, describe cómo se probó el cambio y, para código de simulación, cómo se validaron los resultados frente a valores de referencia conocidos.
6. **Responde a los comentarios de revisión.** Los mantenedores principales revisarán tu PR; la aceptación requiere consenso o ausencia de objeciones dentro de seis semanas.

## Qué buscamos en un pull request

- CI pasa en todas las plataformas (Linux y macOS).
- No hay nuevas advertencias del compilador (`-Wall -Wextra` para código C++).
- El comportamiento nuevo o modificado está cubierto por pruebas.
- Los resultados de simulación se validan frente a una referencia publicada o un resultado analítico conocido.
- Los mensajes de commit son descriptivos y están escritos en modo imperativo.

## Reconocimiento

Los lanzamientos de ALPS van acompañados de una publicación revisada por pares. **Los colaboradores activos se añaden como coautores.** El [Consejo Directivo](../#alps-community-steering-committee) decide la lista de autores para cada lanzamiento, tomando en cuenta las contribuciones al código, la documentación, los tutoriales, las pruebas y el apoyo a la comunidad.

Contribuir en el Nivel 2 o superior — es decir, mejorar la documentación y los tutoriales, corregir bugs o añadir nuevas funcionalidades — con esfuerzo sostenido es el umbral típico para ser considerado como coautor.

## Cómo obtener ayuda

| Canal | Para qué usarlo |
|---|---|
| [Discord](https://discord.gg/JRNWnnva9g) | Preguntas, discusión de desarrollo, conocer a la comunidad |
| [GitHub Issues](https://github.com/ALPSim/ALPS/issues) | Reportes de bugs, solicitudes de funcionalidades, problemas concretos |
| [Talleres de ALPS](../../events) | Reuniones comunitarias presenciales y virtuales |
| [Consejo Directivo](../#alps-community-steering-committee) | Incorporación de nuevos códigos de simulación, contribuciones importantes |
