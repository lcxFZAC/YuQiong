(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) document.body.classList.add('is-touch');

  /* ── Split hero chars ── */
  var titleFg = document.querySelector('.title-fg');
  if (titleFg && !prefersReduced) {
    var text = titleFg.textContent.trim();
    titleFg.textContent = '';
    text.split('').forEach(function (ch, i) {
      var span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', i);
      span.textContent = ch;
      titleFg.appendChild(span);
    });
  }

  /* ── Custom cursor ── */
  var cursor = document.querySelector('.cursor');
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  var mx = 0, my = 0, rx = 0, ry = 0;

  if (cursor && !isTouch) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });
    function animCursor() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    function bindCursorHover(root) {
      (root || document).querySelectorAll('a, button, .masonry-item, .video-card, .tag').forEach(function (el) {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = '1';
        el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
        el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
      });
    }
    bindCursorHover();
    window.__bindCursorHover = bindCursorHover;
    document.addEventListener('mousedown', function () { cursor.classList.add('is-click'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('is-click'); });
  }

  /* ── Scroll progress + header ── */
  var progress = document.querySelector('.scroll-progress');
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    if (header) header.classList.toggle('is-scrolled', scrollTop > 40);
  }, { passive: true });

  /* ── Nav active section ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a');
  var observerNav = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(function (s) { observerNav.observe(s); });

  /* ── Reveal on scroll ── */
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--delay', delay);
  });
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObs.observe(el); });

  var timeline = document.querySelector('.timeline');
  if (timeline) revealObs.observe(timeline);

  var skillsLayout = document.querySelector('.skills-layout');
  if (skillsLayout) {
    var skillObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillObs.observe(skillsLayout);
  }

  /* ── Count up ── */
  function formatNum(n, el) {
    if (n >= 10000) return (n / 10000).toFixed(0) + ' 万';
    return String(n);
  }
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var start = 0;
    var dur = 1400;
    var t0 = performance.now();
    function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(start + (target - start) * eased);
      el.textContent = formatNum(val, el);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, el);
    }
    requestAnimationFrame(step);
  }
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });

  /* ── Hero parallax ── */
  var parallax = document.querySelector('[data-parallax]');
  if (parallax && !prefersReduced && !isTouch) {
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 24;
      var y = (e.clientY / window.innerHeight - 0.5) * 16;
      parallax.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
  }

  /* ── 3D tilt cards ── */
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    if (isTouch || prefersReduced) return;
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Gallery masonry (img/works + data/gallery.json) ── */
  var galleryItems = [];
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCap = document.getElementById('lightbox-caption');
  var lightboxIndex = 0;

  function liveGallery() {
    return galleryItems.filter(Boolean);
  }

  function openLightbox(index) {
    var items = liveGallery();
    if (!lightbox || !items.length) return;
    lightboxIndex = (index + items.length) % items.length;
    var item = items[lightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || item.title || '';
    lightboxCap.textContent = item.title || '';
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lightbox.hidden = true;
        lightboxImg.src = '';
      }
    }, 280);
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { openLightbox(lightboxIndex - 1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { openLightbox(lightboxIndex + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function renderGallery(items) {
    var root = document.getElementById('gallery-masonry');
    var empty = document.getElementById('gallery-empty');
    if (!root) return;

    galleryItems = [];
    root.innerHTML = '';

    var valid = (items || []).filter(function (it) { return it && it.file; });
    if (!valid.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    valid.forEach(function (it, i) {
      var src = 'img/works/' + it.file;
      var title = it.title || '';
      var alt = it.alt || title || it.file;
      galleryItems.push({ src: src, title: title, alt: alt });

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'masonry-item';
      btn.setAttribute('aria-label', '查看：' + (title || it.file));

      var img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      img.onerror = function () {
        btn.remove();
        galleryItems[i] = null;
        if (!root.children.length && empty) empty.hidden = false;
      };

      btn.appendChild(img);
      if (title) {
        var cap = document.createElement('span');
        cap.className = 'masonry-cap';
        cap.textContent = title;
        btn.appendChild(cap);
      }

      btn.addEventListener('click', function () {
        var idx = liveGallery().findIndex(function (g) { return g.src === src; });
        openLightbox(idx >= 0 ? idx : 0);
      });

      root.appendChild(btn);
    });

    if (window.__bindCursorHover) window.__bindCursorHover(root);
  }

  fetch('data/gallery.json')
    .then(function (r) { return r.ok ? r.json() : { items: [] }; })
    .then(function (data) { renderGallery(data.items || data); })
    .catch(function () { renderGallery([]); });

  /* ── Bilibili videos (data/videos.json) — external card links ── */
  function cleanBilibiliUrl(url) {
    if (!url) return '';
    var m = String(url).match(/BV[\w]+/i);
    return m ? 'https://www.bilibili.com/video/' + m[0] : String(url).split('?')[0];
  }

  function renderVideos(list) {
    var root = document.getElementById('video-grid');
    var empty = document.getElementById('videos-empty');
    if (!root) return;
    root.innerHTML = '';

    var videos = (list || []).filter(function (v) { return v && v.url; });
    if (!videos.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    videos.forEach(function (v, i) {
      var href = cleanBilibiliUrl(v.url);
      var card = document.createElement('a');
      card.className = 'video-card tilt-card';
      card.href = href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      var thumb = document.createElement('div');
      thumb.className = 'video-thumb';
      thumb.style.setProperty('--hue', String(24 + i * 48));

      if (v.cover) {
        var cover = document.createElement('img');
        cover.src = v.cover;
        cover.alt = v.title || '';
        cover.loading = 'lazy';
        thumb.appendChild(cover);
      }

      var play = document.createElement('div');
      play.className = 'video-play';
      play.innerHTML = '<span aria-hidden="true">▶</span>';
      thumb.appendChild(play);

      var body = document.createElement('div');
      body.className = 'video-body';
      body.innerHTML = '<h3></h3><p></p><span class="video-link">在 B 站观看 →</span>';
      body.querySelector('h3').textContent = v.title || href;
      body.querySelector('p').textContent = v.desc || '';

      card.appendChild(thumb);
      card.appendChild(body);
      root.appendChild(card);

      if (!isTouch && !prefersReduced) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', function () { card.style.transform = ''; });
      }
    });

    if (window.__bindCursorHover) window.__bindCursorHover(root);
  }

  fetch('data/videos.json')
    .then(function (r) { return r.ok ? r.json() : { videos: [] }; })
    .then(function (data) { renderVideos(data.videos || data); })
    .catch(function () { renderVideos([]); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
    }
  });

  /* ── Magnetic buttons ── */
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    if (isTouch || prefersReduced) return;
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

  /* ── Skill tags toggle ── */
  document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      document.querySelectorAll('.tag').forEach(function (t) { t.classList.remove('active'); });
      tag.classList.add('active');
    });
  });

  /* ── Copy contact ── */
  var toast = document.querySelector('.toast');
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (toast) {
            toast.textContent = '已复制：' + text;
            setTimeout(function () { toast.textContent = ''; }, 2400);
          }
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (toast) toast.textContent = '已复制：' + text;
      }
    });
  });

  /* ── Mobile menu ── */
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Smooth anchor (offset header) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
})();
