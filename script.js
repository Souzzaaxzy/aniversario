/* ==========================================================================
   cartinha de presente — interações
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Conteúdo do presente
     Edite aqui o nome, a mensagem e (se quiser) o áudio de fundo.
     --------------------------------------------------------------------- */
  const GIFT = {
    eyebrow: "para você",
    name: "Feliz aniversário",
    message:
      "que este novo ano da sua vida venha leve, cheio de coisas boas\n" +
      "e de tudo aquilo que faz os seus olhos brilharem.\n" +
      "obrigado por existir. feliz aniversário.",
    audio: "" // ex.: "musica.mp3" — toca após o toque do usuário
  };

  const stage = document.getElementById("stage");
  const letter = document.getElementById("letter");
  const decoField = document.getElementById("decoField");
  const heart = document.getElementById("heart");
  const reveal = document.getElementById("reveal");
  const revealEyebrow = document.getElementById("revealEyebrow");
  const revealName = document.getElementById("revealName");
  const revealMessage = document.getElementById("revealMessage");
  const revealClose = document.getElementById("revealClose");

  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------------------
     Decoração ao redor da carta: estrelas, pontos, linhas curvas e brilhos.
     Posições em % relativas ao campo de decoração (inset -18% -8%).
     --------------------------------------------------------------------- */
  const decorations = [
    { type: "star", x: 12, y: 26, size: 16, delay: 0.5 },
    { type: "star", x: 88, y: 22, size: 12, delay: 0.7 },
    { type: "star", x: 20, y: 72, size: 9,  delay: 0.9 },
    { type: "star", x: 82, y: 76, size: 14, delay: 0.6 },
    { type: "star", x: 50, y: 10, size: 8,  delay: 1.0 },
    { type: "star", x: 20, y: 42, size: 6,  delay: 1.1 },
    { type: "star", x: 82, y: 50, size: 7,  delay: 0.8 },
    { type: "star", x: 8,  y: 50, size: 6,  delay: 1.2 },
    { type: "star", x: 93, y: 44, size: 9,  delay: 0.95 },

    { type: "dot", x: 26, y: 16, size: 3, delay: 0.6 },
    { type: "dot", x: 74, y: 14, size: 2, delay: 0.85 },
    { type: "dot", x: 15, y: 60, size: 2, delay: 1.05 },
    { type: "dot", x: 86, y: 62, size: 3, delay: 0.75 },
    { type: "dot", x: 44, y: 88, size: 2, delay: 1.15 },
    { type: "dot", x: 58, y: 92, size: 2, delay: 0.9 },
    { type: "dot", x: 36, y: 8,  size: 2, delay: 1.0 },
    { type: "dot", x: 64, y: 6,  size: 2, delay: 1.25 },

    { type: "glint", x: 34, y: 86, size: 34, delay: 1.3 },
    { type: "glint", x: 66, y: 84, size: 26, delay: 1.45 },
    { type: "glint", x: 50, y: 96, size: 40, delay: 1.55 }
  ];

  /* linhas curvas que contornam parcialmente a carta */
  const curves = [
    { d: "M6,30 C-2,52 4,74 20,86", delay: 0.9 },
    { d: "M94,20 C104,40 100,62 86,78", delay: 1.1 },
    { d: "M30,4 C50,-4 70,-2 88,8", delay: 1.0 }
  ];

  function buildDecorations() {
    // estrelas, pontos e brilhos
    decorations.forEach((item) => {
      let el;

      if (item.type === "star") {
        el = document.createElementNS(SVG_NS, "svg");
        el.setAttribute("viewBox", "0 0 24 32");
        el.setAttribute("class", "deco deco--star");
        const use = document.createElementNS(SVG_NS, "use");
        use.setAttribute("href", "#star4");
        el.appendChild(use);
        el.style.width = item.size + "px";
        el.style.height = (item.size * 1.34) + "px";
      } else {
        el = document.createElement("span");
        el.className = item.type === "dot" ? "deco deco--dot" : "deco deco--glint";
        el.style.width = item.size + "px";
        el.style.height = item.size + "px";
      }

      el.style.left = item.x + "%";
      el.style.top = item.y + "%";
      el.style.animationDelay = item.delay + "s";
      decoField.appendChild(el);
    });

    // linhas curvas
    const curveSvg = document.createElementNS(SVG_NS, "svg");
    curveSvg.setAttribute("viewBox", "0 0 100 100");
    curveSvg.setAttribute("preserveAspectRatio", "none");
    curveSvg.style.position = "absolute";
    curveSvg.style.inset = "0";
    curveSvg.style.width = "100%";
    curveSvg.style.height = "100%";
    curveSvg.style.overflow = "visible";

    curves.forEach((c) => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", c.d);
      path.setAttribute("class", "deco--curve");
      path.style.animationDelay = c.delay + "s";
      path.setAttribute("vector-effect", "non-scaling-stroke");
      curveSvg.appendChild(path);
    });
    decoField.appendChild(curveSvg);
  }

  /* ---------------------------------------------------------------------
     Abertura / fechamento da carta
     --------------------------------------------------------------------- */
  let isOpen = false;
  let audioEl = null;

  function startAudio() {
    if (!GIFT.audio) return;
    if (!audioEl) {
      audioEl = new Audio(GIFT.audio);
      audioEl.loop = true;
      audioEl.volume = 0.6;
    }
    audioEl.play().catch(() => {});
  }

  /* ---------------------------------------------------------------------
     Coração desenhado ao toque: o traço vermelho "nasce" no meio, sobe
     formando o lado esquerdo, cruza para a direita e fecha o coração.
     O rastro roxo corre logo atrás, mais forte.
     --------------------------------------------------------------------- */
  const heartHeadAnim = document.getElementById("heartHeadAnim");

  function drawHeart() {
    heart.classList.remove("is-active");
    // reinicia as animações (força o navegador a recalcular)
    void heart.offsetWidth;
    heart.classList.add("is-active");

    // ponta de luz que percorre o desenho
    if (heartHeadAnim) {
      try {
        heartHeadAnim.beginElement();
      } catch (e) { /* navegador sem SMIL — o traço ainda é desenhado */ }
    }
  }

  function openLetter() {
    if (isOpen) return;
    isOpen = true;

    drawHeart();
    stage.classList.add("is-open");
    startAudio();

    // revela o conteúdo do presente depois do coração se formar
    window.setTimeout(() => {
      reveal.classList.add("is-visible");
      reveal.setAttribute("aria-hidden", "false");
    }, 2050);
  }

  function closeLetter() {
    if (!isOpen) return;
    isOpen = false;

    heart.classList.remove("is-active");
    reveal.classList.remove("is-visible");
    reveal.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      stage.classList.remove("is-open");
      letter.focus({ preventScroll: true });
    }, 700);
  }

  function init() {
    buildDecorations();

    revealEyebrow.textContent = GIFT.eyebrow;
    revealName.textContent = GIFT.name;
    revealMessage.textContent = GIFT.message;

    letter.addEventListener("click", openLetter);
    revealClose.addEventListener("click", closeLetter);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLetter();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
