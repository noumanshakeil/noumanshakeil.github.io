(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var privacyIds = {
    "privacy-policy": true,
    "privacy-reviewer-and-humanizer": true,
    "privacy-hybrid-ai": true,
    privacy: true
  };

  function splitChars() {
    var root = document.querySelector(".hero-name");
    if (!root) return;
    var lines = root.querySelectorAll(".line");
    lines.forEach(function (line) {
      var text = line.textContent;
      line.textContent = "";
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        var span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? "\u00a0" : ch;
        line.appendChild(span);
      }
    });
  }

  function bindTilt(el, intensity) {
    if (!el) return;
    var plate = el.querySelector(".hero-portrait-plate") || el;
    var ticking = false;
    var mx = 0;
    var my = 0;

    function apply() {
      ticking = false;
      var rect = el.getBoundingClientRect();
      var cx = (mx - (rect.left + rect.width / 2)) / rect.width;
      var cy = (my - (rect.top + rect.height / 2)) / rect.height;
      plate.style.transform =
        "rotateY(" + (cx * intensity) + "deg) rotateX(" + (-cy * intensity * 0.7) + "deg) translateZ(18px)";
    }

    el.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    });
    el.addEventListener("mouseleave", function () {
      plate.style.transform = "";
    });
  }

  function bindHeroType() {
    var stage = document.querySelector(".hero-stage");
    var name = document.querySelector(".hero-name");
    if (!stage || !name) return;
    var chars = name.querySelectorAll(".char");
    var ticking = false;
    var mx = 0;
    var my = 0;

    function apply() {
      ticking = false;
      var rect = stage.getBoundingClientRect();
      var cx = (mx - (rect.left + rect.width / 2)) / rect.width;
      var cy = (my - (rect.top + rect.height / 2)) / rect.height;
      chars.forEach(function (ch, i) {
        var n = (i % 7) - 3;
        ch.style.transform =
          "translateZ(" + (16 + Math.abs(n) * 5) + "px) rotateY(" + (cx * 10 + n) + "deg) rotateX(" + (-cy * 8) + "deg)";
      });
    }

    stage.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    });
    stage.addEventListener("mouseleave", function () {
      chars.forEach(function (ch) { ch.style.transform = ""; });
    });
  }

  function drawField() {
    var canvas = document.getElementById("hero-canvas");
    var hero = document.querySelector(".hero");
    if (!canvas || !canvas.getContext || !hero) return;
    var ctx = canvas.getContext("2d");
    var w = 0;
    var h = 0;
    var nodes = [];

    function resize() {
      var rect = hero.getBoundingClientRect();
      w = canvas.width = Math.max(1, Math.floor(rect.width));
      h = canvas.height = Math.max(1, Math.floor(rect.height));
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    var i;
    for (i = 0; i < 42; i++) {
      nodes.push({
        a: Math.random() * Math.PI * 2,
        b: Math.random() * Math.PI,
        r: 120 + Math.random() * 200,
        s: 0.002 + Math.random() * 0.004,
        flare: Math.random() > 0.78
      });
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      var cx = w * 0.68;
      var cy = h * 0.46;
      var pts = [];
      for (i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.a += n.s;
        var x = Math.cos(n.a) * Math.sin(n.b) * n.r;
        var y = Math.cos(n.b) * n.r * 0.62;
        var z = Math.sin(n.a) * Math.sin(n.b) * n.r;
        var f = 520 / (520 + z);
        pts.push({ x: cx + x * f, y: cy + y * f, z: z, f: f, flare: n.flare });
      }
      for (i = 0; i < pts.length; i++) {
        var a = pts[i];
        for (var j = i + 1; j < pts.length; j++) {
          var b = pts[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 108) {
            ctx.strokeStyle = "rgba(243,240,232," + (0.08 * (1 - dist / 108)) + ")";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.4 * a.f, 0, Math.PI * 2);
        ctx.fillStyle = a.flare
          ? "rgba(228,87,46," + (0.35 + a.f * 0.25) + ")"
          : "rgba(31,75,255," + (0.28 + a.f * 0.25) + ")";
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  if (reduce) return;

  splitChars();
  bindHeroType();
  bindTilt(document.querySelector(".hero-portrait"), 16);
  document.querySelectorAll(".app-card").forEach(function (card) {
    bindTilt(card, 8);
  });
  drawField();

  if (window.Lenis) {
    var lenis = new window.Lenis({
      duration: 1.05,
      smoothWheel: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      var id = el.id || (el.closest("section") && el.closest("section").id);
      if (privacyIds[id] || el.closest("#privacy, #privacy-policy, #privacy-reviewer-and-humanizer, #privacy-hybrid-ai")) {
        return;
      }
      window.gsap.from(el, {
        y: 22,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });
  }
})();
