/* ==========================================================================
   cartinha de presente — interações
   ========================================================================== */

(function () {
  "use strict";

  const stage = document.getElementById("stage");
  const letter = document.getElementById("letter");
  const decoField = document.getElementById("decoField");
  const whitepage = document.getElementById("whitepage");
  const whitepageInner = document.getElementById("whitepageInner");
  const namesPanel = document.getElementById("namesPanel");
  const resultPanel = document.getElementById("resultPanel");
  const showPanel = document.getElementById("showPanel");
  const nextPanel = document.getElementById("nextPanel");

  /* player */
  const audio = document.getElementById("bgAudio");
  const player = document.getElementById("player");
  const playerFill = document.getElementById("playerFill");
  const playerCurrent = document.getElementById("playerCurrent");
  const playerDuration = document.getElementById("playerDuration");

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
     Player: a música começa no toque da carta e a barra corre em loop.
     Os botões são apenas visuais (não têm interação).
     --------------------------------------------------------------------- */
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  function updateProgress() {
    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;

    playerFill.style.width = pct + "%";
    playerCurrent.textContent = formatTime(cur);
  }

  function progressLoop() {
    updateProgress();
    window.requestAnimationFrame(progressLoop);
  }

  function initPlayer() {
    const setDuration = () => {
      playerDuration.textContent = formatTime(audio.duration);
      updateProgress();
    };
    if (audio.readyState >= 1) setDuration();
    audio.addEventListener("loadedmetadata", setDuration);
    audio.addEventListener("durationchange", setDuration);
    // ao dar a volta (loop), a barra reinicia junto com o áudio
    audio.addEventListener("seeked", updateProgress);
    window.requestAnimationFrame(progressLoop);
  }

  /* ---------------------------------------------------------------------
     Abertura da carta
     --------------------------------------------------------------------- */
  let isOpen = false;

  function startAudio() {
    audio.volume = 0.7;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    player.classList.remove("is-paused");
  }

  /* dispara a cena dos personagens (entrar + abraçar o coração) */
  function playNamesReveal() {
    if (!namesPanel) return;
    namesPanel.classList.remove("is-reveal");
    void namesPanel.offsetWidth; /* reinicia as animações */
    namesPanel.classList.add("is-reveal");

    /* depois do abraço + coração grande, as gotas caem e a carta derrete */
    window.setTimeout(startDrip, 9600);
  }

  /* "chove" gotas do nome e rola para a carta desenhada que se forma */
  function startDrip() {
    if (!namesPanel || namesPanel.classList.contains("is-melting")) return;
    namesPanel.classList.add("is-melting");
    /* enquanto as gotas caem, desce até a terceira tela */
    window.setTimeout(() => {
      if (whitepageInner && resultPanel) {
        whitepageInner.scrollTo({ top: resultPanel.offsetTop, behavior: "smooth" });
      }
    }, 500);
    /* a carta desenhada se forma */
    window.setTimeout(() => {
      if (resultPanel) resultPanel.classList.add("is-dripped");
    }, 950);

    /* vendo a carta, desce para a cena do menino com a menina */
    window.setTimeout(() => {
      if (whitepageInner && showPanel) {
        whitepageInner.scrollTo({ top: showPanel.offsetTop, behavior: "smooth" });
      }
      window.setTimeout(runShow, 800);
    }, 3200);
  }

  /* a cena: os dois descem a "escada invisível" e ela fica muito feliz */
  function runShow() {
    if (!showPanel || showPanel.classList.contains("is-run")) return;
    showPanel.classList.remove("is-run");
    void showPanel.offsetWidth;
    showPanel.classList.add("is-run");

    /* no fim, a tela desce para a próxima parte */
    window.setTimeout(() => {
      if (whitepageInner && nextPanel) {
        whitepageInner.scrollTo({ top: nextPanel.offsetTop, behavior: "smooth" });
      }
      window.setTimeout(typeLetter, 900);
    }, 10600);
  }

  /* revela a mensagem palavra por palavra */
  function typeLetter() {
    const el = document.getElementById("letterText");
    if (!el || el.dataset.typed === "1") return;
    el.dataset.typed = "1";

    const text = el.textContent;
    el.textContent = "";

    /* separa em tokens mantendo os espaços e as quebras de linha */
    const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);

    tokens.forEach((tok) => {
      if (/^\s+$/.test(tok)) {
        /* espaços e quebras viram nós de texto normais */
        el.appendChild(document.createTextNode(tok));
      } else {
        const span = document.createElement("span");
        span.className = "w";
        span.textContent = tok;
        el.appendChild(span);
      }
    });

    const words = el.querySelectorAll(".w");
    words.forEach((w, i) => {
      window.setTimeout(() => w.classList.add("is-shown"), 150 * i);
    });
  }

  /* rola automaticamente para a próxima parte (os nomes) */
  function scrollToNames() {
    if (!whitepageInner || !namesPanel) return;
    whitepageInner.scrollTo({ top: namesPanel.offsetTop, behavior: "smooth" });
    /* quando a rolagem terminar, os personagens entram */
    window.setTimeout(playNamesReveal, 700);
  }

  /* se o usuário rolar manualmente até os nomes, a cena também acontece */
  function initNamesReveal() {
    if (!namesPanel || !whitepageInner) return;
    whitepageInner.addEventListener("scroll", () => {
      if (whitepageInner.scrollTop > namesPanel.offsetTop * 0.6) {
        if (!namesPanel.classList.contains("is-reveal")) playNamesReveal();
      }
    });
  }

  function openLetter() {
    if (isOpen) return;
    isOpen = true;

    // a carta abre: a aba levanta, o selo se solta e o pingente cai
    stage.classList.add("is-open");
    startAudio();

    // depois da abertura, a carta some e a página branca entra
    window.setTimeout(() => {
      stage.classList.add("is-leaving");
    }, 1500);

    window.setTimeout(() => {
      whitepage.classList.add("is-visible");
      whitepage.setAttribute("aria-hidden", "false");

      // 3 segundos vendo o card do player, então o scroll vai para os nomes
      window.setTimeout(scrollToNames, 3000);
    }, 2250);
  }

  function init() {
    buildDecorations();
    initPlayer();
    initNamesReveal();
    letter.addEventListener("click", openLetter);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
