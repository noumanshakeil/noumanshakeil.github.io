(function () {
  "use strict";

  var CONTACT_NUMBER = "923405055603";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    var toggle = $("#nav-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }
  }

  var toggle = $("#nav-toggle");
  var links = $("#nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "✕" : "☰";
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        $$("details", links).forEach(function (d) { d.open = false; });
        closeNav();
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1100) closeNav();
    });
  }

  function scrollHashTarget() {
    if (!location.hash) return;
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function openLayerForHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var details = el.matches("details") ? el : el.closest("details");
    if (details) details.open = true;
    if (id === "certificates" || id === "projects" || id === "experience" || id === "pocketmind") {
      var nested = el.querySelector("details.layer");
      if (nested && (id === "certificates" || id === "projects")) nested.open = true;
    }
  }

  window.addEventListener("hashchange", function () {
    openLayerForHash();
    scrollHashTarget();
  });
  window.addEventListener("load", function () {
    if (location.hash) {
      openLayerForHash();
      requestAnimationFrame(scrollHashTarget);
    }
  });

  function bindFilters(groupSel, itemSel, attr) {
    var group = $(groupSel);
    if (!group) return;
    $$("button", group).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("button", group).forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var key = btn.getAttribute("data-filter");
        $$(itemSel).forEach(function (item) {
          var tags = (item.getAttribute(attr) || "").split(/\s+/);
          item.hidden = key !== "all" && tags.indexOf(key) === -1;
        });
      });
    });
  }

  bindFilters("#project-filters", ".project-card", "data-tags");
  bindFilters("#cert-filters", ".cert-card", "data-cat");

  var form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#f-name").value.trim();
      var phone = $("#f-phone").value.trim();
      var service = $("#f-service").value.trim();
      var budget = $("#f-budget").value.trim();
      var msg = $("#f-message").value.trim();
      var status = $("#form-status");
      var required = [name, phone, service, msg];
      if (required.some(function (v) { return !v; })) {
        status.textContent = "Please fill in your name, contact number, service needed, and project details.";
        status.className = "form-status is-error";
        return;
      }
      var text =
        "Hi Nouman, I want to discuss a project.%0A%0AName: " +
        encodeURIComponent(name) +
        "%0AContact Number: " +
        encodeURIComponent(phone) +
        "%0AService Needed: " +
        encodeURIComponent(service) +
        "%0ABudget / Timeline: " +
        encodeURIComponent(budget || "Not specified") +
        "%0A%0AProject Details:%0A" +
        encodeURIComponent(msg) +
        "%0A%0AI came from your portfolio website.";
      status.textContent = "Opening your prepared project message.";
      status.className = "form-status is-ok";
      window.open("https://wa.me/" + CONTACT_NUMBER + "?text=" + text, "_blank", "noopener");
    });
  }
})();
