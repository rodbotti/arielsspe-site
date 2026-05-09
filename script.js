/* ============================================================
   Ariel — script.js
   Minimal vanilla JS: theme toggle, scroll reveal, nav border,
   form behavior with mailto fallback. No dependencies.
   ============================================================ */

(function () {
  "use strict";

  const lang = (document.documentElement.lang || "pt").toLowerCase().startsWith("en") ? "en" : "pt";

  const t = {
    pt: {
      sending:        "Enviando…",
      ackRequired:    "Por favor, confirme a declaração de investidor profissional.",
      missingFields:  "Preencha os campos obrigatórios.",
      thanks:         "Obrigado. Sua mensagem foi preparada — confirme o envio no seu cliente de e-mail.",
      thanksAjax:     "Obrigado. Sua mensagem foi recebida. Entraremos em contato em breve.",
      errorGeneric:   "Não foi possível enviar agora. Tente novamente, ou escreva para contato@arielsspe.com.",
      themeToLight:   "Mudar para tema claro",
      themeToDark:    "Mudar para tema escuro"
    },
    en: {
      sending:        "Sending…",
      ackRequired:    "Please confirm the professional investor declaration.",
      missingFields:  "Please fill in the required fields.",
      thanks:         "Thank you. Your message has been prepared — confirm sending in your email client.",
      thanksAjax:     "Thank you. Your message has been received. We will be in touch shortly.",
      errorGeneric:   "Could not send right now. Please try again, or write to contato@arielsspe.com.",
      themeToLight:   "Switch to light theme",
      themeToDark:    "Switch to dark theme"
    }
  }[lang];

  /* ----------------------------------------------------------
     Theme toggle
     - Initial theme is set by an inline <script> in <head> to
       prevent flash. This block handles the user-driven toggle.
     - Persists explicit choice in localStorage as "ariel.theme".
     - If user has not made an explicit choice, follows
       prefers-color-scheme changes in real time.
     ---------------------------------------------------------- */
  const STORAGE_KEY = "ariel.theme";
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#F5F4F0" : "#06080A");
    const btn = document.getElementById("themeToggle");
    if (btn) btn.setAttribute("aria-label", theme === "dark" ? t.themeToLight : t.themeToDark);
  };

  applyTheme(root.getAttribute("data-theme") || "dark");

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  /* React to OS theme change only if user hasn't chosen explicitly */
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener && mq.addEventListener("change", (ev) => {
      let saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
      if (saved) return;
      applyTheme(ev.matches ? "light" : "dark");
    });
  }

  /* ----------------------------------------------------------
     Year in footer
     ---------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Sticky nav — bottom border once scrolled
     ---------------------------------------------------------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     Scroll reveal — gentle fade-up
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ----------------------------------------------------------
     Smooth in-page anchor scrolling for older Safari
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (ev) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  /* ----------------------------------------------------------
     Contact form
     - Validates required fields.
     - CVM 160 declaration is always-visible and optional.
     - Falls back to mailto: when no ARIEL_FORM_ENDPOINT is set.
     ---------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const ENDPOINT = (typeof window !== "undefined" && window.ARIEL_FORM_ENDPOINT) || "";
    const RECIPIENT = "contato@arielsspe.com";

    const investorAck = form.querySelector("#investorAck");
    const feedback = form.querySelector("#formFeedback");
    const submitBtn = form.querySelector('button[type="submit"]');

    const setFeedback = (msg, isError) => {
      feedback.textContent = msg;
      feedback.classList.toggle("error", !!isError);
      feedback.classList.add("show");
    };

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      feedback.classList.remove("show", "error");

      const data = {
        name:    form.name.value.trim(),
        email:   form.email.value.trim(),
        org:     form.org.value.trim(),
        message: form.message.value.trim(),
        ack:     investorAck ? investorAck.checked : false
      };

      if (!data.name || !data.email || !data.message) {
        setFeedback(t.missingFields, true);
        return;
      }

      submitBtn.disabled = true;
      const originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = t.sending;

      const send = async () => {
        if (ENDPOINT) {
          try {
            const res = await fetch(ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("bad status");
            setFeedback(t.thanksAjax, false);
            form.reset();
          } catch (err) {
            setFeedback(t.errorGeneric, true);
          }
        } else {
          const subject = encodeURIComponent("[arielsspe.com] contato — " + data.name);
          const body = encodeURIComponent(
            "Nome: "         + data.name +
            "\nE-mail: "    + data.email +
            "\nOrganização: " + (data.org || "—") +
            (data.ack ? "\n\n[Declaração CVM 160 confirmada pelo remetente]" : "") +
            "\n\nMensagem:\n" + data.message
          );
          window.location.href = "mailto:" + RECIPIENT + "?subject=" + subject + "&body=" + body;
          setFeedback(t.thanks, false);
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      };

      send();
    });
  }
})();
