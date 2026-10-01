/* ============================================================
   MOTOSOLUTIONS — small interaction layer
   - Mobile menu toggle
   - Reveal-on-scroll for sections
   - Current year in footer
   The marquee ticker runs on pure CSS (see .ticker__track).
   ============================================================ */

(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });

    // Close menu after tapping a link
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });
  }

  /* ---- Helmet collection grid + lightbox ---- */
  (function buildCollection() {
    var grid = document.getElementById("helmetGrid");
    var helmets = window.HELMETS;
    if (!grid || !helmets || !helmets.length) return;

    var IG = "https://www.instagram.com/_motosolutions";

    // Build cards
    helmets.forEach(function (h, i) {
      var card = document.createElement("article");
      card.className = "card helmet";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "View " + h.name + " — " + h.shots.length + " photos");
      card.innerHTML =
        '<div class="card__media">' +
          '<img class="helmet__img" src="' + h.cover + '" alt="' + h.name + ' — ' + h.model + '" loading="lazy" />' +
          '<span class="helmet__count">' +
            '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="13" rx="2.5"/><path d="M3.5 14l4.5-4 4 3.5 3.5-3 5 4.5"/><circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none"/></svg>' +
            h.shots.length +
          '</span>' +
          '<span class="helmet__view">View all ' + h.shots.length + ' angles</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="helmet__model">' + h.model + '</span>' +
          '<h3 class="card__title">' + h.name + '</h3>' +
          '<span class="card__cta">View &amp; Reserve ' +
            '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>' +
          '</span>' +
          '<span class="card__note">Message for price &amp; availability</span>' +
        '</div>';
      card.addEventListener("click", function () { openLightbox(i); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
      });

      /* ---- Hover: auto-cycle through the 5 angles every 2s ---- */
      var imgEl = card.querySelector(".helmet__img");
      var timer = null, shot = 0, preloaded = false;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function showShot(idx) {
        imgEl.classList.add("is-swapping");           // fade out
        setTimeout(function () {
          imgEl.src = h.shots[idx];                    // swap (cached after preload)
          imgEl.classList.remove("is-swapping");       // fade in
        }, 180);
      }
      function startPreview() {
        if (reduce || timer || h.shots.length < 2) return;
        if (!preloaded) {                              // warm the cache once
          h.shots.forEach(function (s) { var im = new Image(); im.src = s; });
          preloaded = true;
        }
        card.classList.add("is-previewing");
        shot = 0;
        timer = setInterval(function () {
          shot = (shot + 1) % h.shots.length;
          showShot(shot);
        }, 1000);
      }
      function stopPreview() {
        if (timer) { clearInterval(timer); timer = null; }
        card.classList.remove("is-previewing");
        shot = 0;
        imgEl.classList.remove("is-swapping");
        imgEl.src = h.cover;                           // back to the cover angle
      }
      card.addEventListener("mouseenter", startPreview);
      card.addEventListener("mouseleave", stopPreview);
      card.addEventListener("focus", startPreview);
      card.addEventListener("blur", stopPreview);

      grid.appendChild(card);
    });

    // Lightbox
    var lb = document.getElementById("lightbox");
    var lbImg = document.getElementById("lbImg");
    var lbIndex = document.getElementById("lbIndex");
    var lbTotal = document.getElementById("lbTotal");
    var lbModel = document.getElementById("lbModel");
    var lbTitle = document.getElementById("lbTitle");
    var lbThumbs = document.getElementById("lbThumbs");
    var lbReserve = document.getElementById("lbReserve");
    var lbPrev = document.getElementById("lbPrev");
    var lbNext = document.getElementById("lbNext");
    var cur = 0, shot = 0, lastFocus = null;

    function renderShot() {
      var h = helmets[cur];
      lbImg.src = h.shots[shot];
      lbImg.alt = h.name + " — angle " + (shot + 1) + " of " + h.shots.length;
      lbIndex.textContent = String(shot + 1);
      // preload neighbour
      var nxt = new Image(); nxt.src = h.shots[(shot + 1) % h.shots.length];
      Array.prototype.forEach.call(lbThumbs.children, function (t, idx) {
        t.classList.toggle("is-active", idx === shot);
      });
    }

    function openLightbox(idx) {
      cur = idx; shot = 0;
      var h = helmets[cur];
      lbModel.textContent = h.model;
      lbTitle.textContent = h.name;
      lbTotal.textContent = String(h.shots.length);
      lbReserve.href = IG;
      // thumbnails
      lbThumbs.innerHTML = "";
      h.shots.forEach(function (src, k) {
        var b = document.createElement("button");
        b.className = "lb__thumb";
        b.setAttribute("aria-label", "Angle " + (k + 1));
        b.innerHTML = '<img src="' + src + '" alt="" loading="lazy" />';
        b.addEventListener("click", function () { shot = k; renderShot(); });
        lbThumbs.appendChild(b);
      });
      renderShot();
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      document.getElementById("lbNext").focus();
    }

    function closeLightbox() {
      lb.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function step(d) {
      var n = helmets[cur].shots.length;
      shot = (shot + d + n) % n;
      renderShot();
    }

    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
    lb.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });
    // swipe on touch
    var sx = null;
    lbImg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lbImg.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      sx = null;
    });
  })();

  /* ---- Reels: focal carousel — one active reel plays, others recede ---- */
  (function reels() {
    var strip = document.getElementById("reelStrip");
    if (!strip) return;

    var SOURCES = [
      "media/reel1.mp4", "media/reel2.mp4", "media/reel3.mp4", "media/reel4.mp4",
      "media/reel5.mp4", "media/reel6.mp4", "media/reel7.mp4", "media/reel.mp4"
    ];
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cards = [], videos = [], dots = [];
    var active = -1, inView = false;

    SOURCES.forEach(function (src, i) {
      var card = document.createElement("div");
      card.className = "reel-card";
      card.setAttribute("role", "listitem");
      card.innerHTML =
        '<div class="reel__frame">' +
          '<video class="reel__video" muted loop playsinline preload="none" ' +
                 'aria-label="Motosolutions reel ' + (i + 1) + '"></video>' +
          '<span class="reel__progress"></span>' +
        '</div>';
      var v = card.querySelector("video");
      v.dataset.src = src;
      cards.push(card); videos.push(v);

      // click a receded reel to bring it to centre
      card.addEventListener("click", function () {
        if (!card.classList.contains("is-active")) centerCard(i);
      });

      // progress bar
      v.addEventListener("timeupdate", function () {
        if (!v.duration) return;
        var p = card.querySelector(".reel__progress");
        if (p) p.style.width = (v.currentTime / v.duration * 100).toFixed(2) + "%";
      });

      strip.appendChild(card);
    });

    // dot navigation
    var dotsWrap = document.getElementById("reelDots");
    if (dotsWrap) {
      SOURCES.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = "reel-dot"; d.type = "button";
        d.setAttribute("aria-label", "Go to reel " + (i + 1));
        d.addEventListener("click", function () { centerCard(i); });
        dotsWrap.appendChild(d); dots.push(d);
      });
    }

    function loadAndPlay(v) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;   // lazy-load
      if (!reduce && inView) v.play().catch(function () {});
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      cards.forEach(function (c, idx) {
        var on = idx === i, v = videos[idx];
        c.classList.toggle("is-active", on);
        if (dots[idx]) dots[idx].classList.toggle("is-on", on);
        if (on) {
          loadAndPlay(v);
        } else {
          v.pause();
          var p = c.querySelector(".reel__progress");
          if (p) p.style.width = "0%";
        }
      });
    }

    function nearestToCenter() {
      var r = strip.getBoundingClientRect(), cx = r.left + r.width / 2;
      var best = 0, bestD = Infinity;
      cards.forEach(function (c, idx) {
        var b = c.getBoundingClientRect(), d = Math.abs((b.left + b.width / 2) - cx);
        if (d < bestD) { bestD = d; best = idx; }
      });
      return best;
    }
    function centerCard(i) {
      var c = cards[i]; if (!c) return;
      strip.scrollTo({ left: c.offsetLeft - (strip.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
      setActive(i);
    }

    var raf = null;
    strip.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; setActive(nearestToCenter()); });
    }, { passive: true });

    var prev = document.getElementById("reelPrev"), next = document.getElementById("reelNext");
    if (prev) prev.addEventListener("click", function () { centerCard(Math.max(0, active - 1)); });
    if (next) next.addEventListener("click", function () { centerCard(Math.min(cards.length - 1, active + 1)); });

    if (reduce) {
      videos.forEach(function (v) { v.controls = true; });
      inView = true;
      setActive(Math.min(1, cards.length - 1));
      cards.forEach(function (c) { c.classList.add("is-active"); });   // show all, no motion bias
    } else {
      // position the carousel (second reel centred, peeks on both sides)
      var startI = Math.min(1, cards.length - 1);
      setActive(startI);
      requestAnimationFrame(function () {
        var c = cards[startI];
        if (c) strip.scrollLeft = c.offsetLeft - (strip.clientWidth - c.offsetWidth) / 2;
      });
      // only play while the strip is on screen
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            inView = e.isIntersecting;
            if (inView) {
              if (active < 0) setActive(nearestToCenter());
              if (videos[active]) loadAndPlay(videos[active]);
            } else {
              videos.forEach(function (v) { v.pause(); });
            }
          });
        }, { threshold: 0.25 }).observe(strip);
      } else { inView = true; setActive(nearestToCenter()); }
    }
  })();

  /* ---- Launch cinematic: scroll-scrub the video frame-by-frame ---- */
  (function launch() {
    var sec = document.getElementById("launch");
    var video = document.getElementById("launchVideo");
    if (!sec || !video) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var vh = window.innerHeight;
    var duration = 0;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function progress() {
      var rect = sec.getBoundingClientRect();
      var total = sec.offsetHeight - vh;
      return clamp(-rect.top / total, 0, 1);
    }

    // coalesced seeking — only one seek in flight, always chase the latest target
    var pending = null, isSeeking = false;
    function seekTo(t) {
      if (isSeeking) { pending = t; return; }
      if (Math.abs(t - video.currentTime) < 0.01) return;
      isSeeking = true;
      var onSeeked = function () {
        isSeeking = false;
        video.removeEventListener("seeked", onSeeked);
        if (pending != null) { var p = pending; pending = null; seekTo(p); }
      };
      video.addEventListener("seeked", onSeeked);
      try { video.currentTime = t; } catch (e) { isSeeking = false; }
    }
    function tick() { if (duration) seekTo((1 - progress()) * duration); }  /* reversed: scroll down = play backward */

    video.addEventListener("loadedmetadata", function () {
      duration = video.duration || 0;
      try { video.pause(); } catch (e) {}
      tick();
    });
    if (video.readyState >= 1) { duration = video.duration || 0; tick(); }

    if (reduce) return;   // no scrubbing; first frame stays

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { tick(); ticking = false; }); }
    }, { passive: true });
    window.addEventListener("resize", function () { vh = window.innerHeight; tick(); });
  })();

  /* ---- Reveal on scroll ---- */
  var targets = document.querySelectorAll(
    ".section__head, .about__inner, .auth__media, .auth__copy, .card, .step, .cta-band__inner"
  );

  targets.forEach(function (el) { el.classList.add("reveal"); });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // small stagger for grouped items
            var delay = entry.target.closest(".grid, .steps") ? (i % 3) * 90 : 0;
            setTimeout(function () { entry.target.classList.add("in"); }, delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach(function (el) { io.observe(el); });
  }
})();
