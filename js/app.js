/**
 * Aswin & Athira — The Wedding Celebration at Kodanat Mana
 * Production Interactive Controller (Vanilla JS)
 */

(function () {
  'use strict';

  // =========================================================================
  // 0. INITIALIZATION & HELPERS
  // =========================================================================
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Luxury Toast Notification
  let toastTimeout = null;
  function showToast(message, iconName = 'sparkles') {
    const toast = document.getElementById('luxury-toast');
    const toastText = document.getElementById('luxury-toast-text');
    const toastIcon = document.getElementById('luxury-toast-icon');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    if (toastIcon) {
      toastIcon.setAttribute('data-lucide', iconName);
      refreshIcons();
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3600);
  }

  window.showToast = showToast;

  // =========================================================================
  // 1. STICKY NAVBAR, SCROLL PROGRESS & SCROLL SPY
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add(
          'lg:bg-emerald-950/95',
          'lg:backdrop-blur-xl',
          'shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
          'py-2.5',
          'lg:py-3.5',
          'lg:border-champagne-500/20'
        );
        navbar.classList.remove(
          'py-3',
          'lg:py-5',
          'lg:bg-transparent',
          'lg:backdrop-blur-none',
          'lg:border-transparent'
        );
      } else {
        navbar.classList.remove(
          'lg:bg-emerald-950/95',
          'lg:backdrop-blur-xl',
          'shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
          'py-2.5',
          'lg:py-3.5',
          'lg:border-champagne-500/20'
        );
        navbar.classList.add(
          'py-3',
          'lg:py-5',
          'lg:bg-transparent',
          'lg:backdrop-blur-none',
          'lg:border-transparent'
        );
      }
    }

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      scrollProgress.style.width = `${pct}%`;
    }

    let currentSectionId = 'hero';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      if (scrollY >= top) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 2. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // =========================================================================
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -35px 0px',
    }
  );

  document.querySelectorAll('.reveal-elem').forEach((el) => revealObserver.observe(el));

  // =========================================================================
  // 3. FALLING FLOWER PETALS ENGINE & CELEBRATORY BURST
  // =========================================================================
  const petalsContainer = document.getElementById('petals-container');
  const togglePetalsBtn = document.getElementById('toggle-petals-btn');
  const petalColors = ['#DFC27C', '#F6EEDB', '#E0A899', '#FFEAA7', '#FFD54F', '#EBD49D'];
  let petalsEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createPetal(isBurst = false) {
    if (!petalsContainer || (!petalsEnabled && !isBurst)) return;
    const maxPetals = isBurst ? 45 : 24;
    if (petalsContainer.children.length > maxPetals) return;

    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = Math.random() * 8 + 6;
    const left = isBurst ? 20 + Math.random() * 60 : Math.random() * 100;
    const duration = isBurst ? Math.random() * 5 + 4.5 : Math.random() * 9 + 8.5;
    const sway = (Math.random() - 0.5) * 90;
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.38}px`;
    petal.style.borderRadius = '50% 0 50% 50%';
    petal.style.backgroundColor = color;
    petal.style.left = `${left}vw`;
    petal.style.top = '-24px';
    petal.style.setProperty('--petal-sway', `${sway}px`);
    petal.style.animationDuration = `${duration}s`;
    petal.style.filter = 'blur(0.4px)';

    petalsContainer.appendChild(petal);
    setTimeout(() => {
      petal.remove();
    }, duration * 1000);
  }

  function burstPetals(count = 16) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createPetal(true), i * 80);
    }
  }
  window.burstPetals = burstPetals;

  for (let i = 0; i < 6; i++) {
    setTimeout(() => createPetal(false), i * 300);
  }
  setInterval(() => createPetal(false), 750);

  if (togglePetalsBtn) {
    togglePetalsBtn.addEventListener('click', () => {
      petalsEnabled = !petalsEnabled;
      togglePetalsBtn.classList.toggle('opacity-50', !petalsEnabled);
      if (!petalsEnabled && petalsContainer) {
        petalsContainer.innerHTML = '';
        showToast('Falling marigold & jasmine petals paused', 'pause');
      } else {
        burstPetals(10);
        showToast('Falling marigold & jasmine petals resumed', 'sparkles');
      }
    });
  }

  // =========================================================================
  // 4. YOUTUBE BACKGROUND MUSIC (https://youtu.be/0_OvwPWMWYU)
  // =========================================================================
  const YT_VIDEO_ID = '0_OvwPWMWYU';
  const ytIframeEl = document.getElementById('yt-bgm-player');
  let ytPlayer = null;
  let ytPlayerReady = false;
  let unmutedConfirmed = false;
  const unlockEvents = [
    'pointerdown',
    'pointerup',
    'touchstart',
    'touchend',
    'touchmove',
    'click',
    'keydown',
    'scroll',
  ];

  // Direct low-latency postMessage helper (fires even before YT.Player API script finishes)
  function sendYtCommand(func, args = []) {
    if (ytIframeEl && ytIframeEl.contentWindow) {
      try {
        ytIframeEl.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (_) {
        // Ignore cross-origin transient state
      }
    }
  }

  function tryStartUnmutedBgm() {
    if (unmutedConfirmed) return;
    sendYtCommand('unMute');
    sendYtCommand('setVolume', [80]);
    sendYtCommand('playVideo');

    if (ytPlayer && ytPlayerReady) {
      try {
        ytPlayer.unMute();
        ytPlayer.setVolume(80);
        ytPlayer.playVideo();
      } catch (_) {
        // Ignore transient player readiness errors
      }
    }
  }

  function removeGestureUnlockListeners() {
    unlockEvents.forEach((evt) => {
      window.removeEventListener(evt, tryStartUnmutedBgm, true);
      document.removeEventListener(evt, tryStartUnmutedBgm, true);
    });
  }

  unlockEvents.forEach((evt) => {
    window.addEventListener(evt, tryStartUnmutedBgm, { capture: true, passive: true });
    document.addEventListener(evt, tryStartUnmutedBgm, { capture: true, passive: true });
  });

  // Trigger immediate launch playback as soon as pre-embedded iframe finishes loading
  if (ytIframeEl) {
    ytIframeEl.addEventListener('load', () => {
      tryStartUnmutedBgm();
      setTimeout(tryStartUnmutedBgm, 250);
      setTimeout(tryStartUnmutedBgm, 800);
    });
  }

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new window.YT.Player('yt-bgm-player', {
      events: {
        onReady: function (event) {
          ytPlayerReady = true;

          // Attempt immediate unmuted playback right on launch
          event.target.setVolume(80);
          event.target.unMute();
          event.target.playVideo();

          // Check shortly after: if strict mobile OS policy blocked unmuted start,
          // pre-buffer & stream muted so audio unmutes at 0ms on first scroll/touch
          setTimeout(() => {
            if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
            const state = ytPlayer.getPlayerState();
            if (state === window.YT.PlayerState.PLAYING && !ytPlayer.isMuted()) {
              unmutedConfirmed = true;
              removeGestureUnlockListeners();
            } else if (state !== window.YT.PlayerState.PLAYING) {
              ytPlayer.mute();
              ytPlayer.playVideo();
            }
          }, 600);
        },
        onStateChange: function (event) {
          if (event.data === window.YT.PlayerState.ENDED) {
            event.target.seekTo(0);
            event.target.playVideo();
          } else if (
            event.data === window.YT.PlayerState.PLAYING &&
            ytPlayer &&
            typeof ytPlayer.isMuted === 'function' &&
            !ytPlayer.isMuted()
          ) {
            unmutedConfirmed = true;
            removeGestureUnlockListeners();
          }
        },
      },
    });
  };

  // Load YouTube IFrame Player API asynchronously
  (function loadYouTubeApi() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(tag, firstScript);
    } else {
      document.head.appendChild(tag);
    }
  })();

  // =========================================================================
  // 5. REAL-TIME COUNTDOWN TIMER
  //    Target: Dec 27, 2026 15:30:00 IST (UTC+5:30) — Celebrations Kickoff
  // =========================================================================
  let targetWeddingDate = new Date('2026-12-27T15:30:00+05:30').getTime();

  if (targetWeddingDate <= Date.now()) {
    const nextYear = new Date().getFullYear() + 1;
    targetWeddingDate = new Date(`${nextYear}-12-27T15:30:00+05:30`).getTime();
  }

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  function updateCountdown() {
    const now = Date.now();
    const distance = Math.max(0, targetWeddingDate - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) {
      secondsEl.textContent = String(seconds).padStart(2, '0');
      secondsEl.classList.add('timer-tick');
      setTimeout(() => secondsEl.classList.remove('timer-tick'), 220);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 6. SAVE THE DATE CALENDAR (.ICS) EXPORT & VENUE ADDRESS COPY
  // =========================================================================
  const calendarEvents = {
    all: {
      title: 'Aswin & Athira — The Wedding Celebration',
      start: '20261227T100000Z',
      end: '20261228T083000Z',
      location:
        'Kodanat Mana (160+ Year Old Heritage Mana), Vellarakkad, Thrissur, Kerala 680584, India',
      description:
        'Celebration Itinerary at Kodanat Mana (160+ Year Old Traditional Kerala Mana):\\n- Sunday, Dec 27, 2026 (3:30 PM): The Haldi Ceremony (Outdoor Lawn • Color Code: Yellow)\\n- Sunday, Dec 27, 2026 (6:30 PM): The Grand Sangeeth (Outdoor Lawn • Color Code: Black)\\n- Monday, Dec 28, 2026 (Muhurtham starts from 10:00AM): The Wedding Ceremony (Inside Kodanat Mana • Dress Code: Traditional Wear)\\nNearest Railway Station: Guruvayur Railway Station\\nGoogle Maps: https://www.google.com/maps/place/Kodanat+Mana/data=!4m2!3m1!1s0x0:0x7e9172ab833b3dd6?sa=X&ved=1t:2428&ictx=111',
      filename: 'Aswin-Athira-Wedding-Kodanat-Mana.ics',
    },
  };

  function downloadCalendarEvent(eventKey) {
    const ev = calendarEvents[eventKey] || calendarEvents.all;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aswin & Athira Wedding//Kodanat Mana//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${eventKey}-${Date.now()}@aswinathirawedding.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${ev.start}`,
      `DTEND:${ev.end}`,
      `SUMMARY:${ev.title}`,
      `LOCATION:${ev.location}`,
      `DESCRIPTION:${ev.description}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ev.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    burstPetals(10);
    showToast(`Saved "${ev.title}" to your calendar`, 'calendar-check');
  }

  window.downloadCalendarEvent = downloadCalendarEvent;

  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addr =
        'Kodanat Mana (160+ Year Old Heritage Mana), Vellarakkad, Thrissur, Kerala 680584, India';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(() => {
          showToast('Venue address copied to clipboard!', 'check-circle');
        });
      } else {
        showToast(addr, 'map-pin');
      }
    });
  }

  // =========================================================================
  // 7. SUPABASE LIVE GUESTBOOK & MANUAL + AUTO-SCROLLING STREAM
  // =========================================================================
  const SUPABASE_URL = 'https://puuloghcykkoqqpdnovq.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_XS6RPO9iFjv90G1NmpMOzA_b-E4M9cv';

  const SUPABASE_HEADERS = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    'Content-Type': 'application/json',
  };

  let wishesData = [];
  let isLoadingWishes = true;
  const sessionNewWishIds = new Set();

  function formatRelativeTime(isoDateStr) {
    if (!isoDateStr) return 'Recently';
    const createdMs = new Date(isoDateStr).getTime();
    if (Number.isNaN(createdMs)) return 'Recently';

    const diffSec = Math.max(0, Math.floor((Date.now() - createdMs) / 1000));
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 14) return `${diffDay} days ago`;

    return new Date(createdMs).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const marqueeContainer = document.getElementById('marquee-container');
  const marqueeTrack = document.getElementById('marquee-track');
  const wishCountBadge = document.getElementById('wish-count-badge');

  function createWishCardHtml(w) {
    const isNew = sessionNewWishIds.has(Number(w.id));
    const borderClass = isNew
      ? 'border-2 border-champagne-500 ring-4 ring-champagne-400/15'
      : 'border border-champagne-300/60';
    const timeLabel = formatRelativeTime(w.created_at);
    const timeBadge = isNew
      ? `<span class="text-[10px] text-emerald-800 font-semibold px-2.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-200">Just added</span>`
      : `<span class="text-[10px] text-slate-400 font-light">${escapeHtml(timeLabel)}</span>`;

    return `
      <article class="w-[82vw] max-w-[330px] sm:w-96 sm:max-w-none flex-shrink-0 bg-white p-5 sm:p-6 rounded-2xl ${borderClass} shadow-md hover:shadow-xl transition-all duration-300 hover:border-champagne-500 flex flex-col justify-between select-none">
        <div>
          <div class="flex items-start justify-between mb-3 gap-2">
            <div>
              <h5 class="font-serif text-lg font-semibold text-emerald-950 leading-snug">${escapeHtml(w.name)}</h5>
              <span class="text-[10px] uppercase tracking-wider text-champagne-600 font-sans font-semibold">${escapeHtml(w.relation || 'Well Wisher')}</span>
            </div>
            ${timeBadge}
          </div>
          <p class="font-serif italic text-slate-700 text-base leading-relaxed mb-4">
            "${escapeHtml(w.message)}"
          </p>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-ivory-200">
          <div class="text-[11px] text-champagne-600 flex items-center gap-1.5 font-sans font-medium">
            <span>✨ ${escapeHtml(w.location || 'Wedding Guestbook')}</span>
          </div>
          <button
            type="button"
            data-like-id="${escapeHtml(String(w.id))}"
            class="wish-like-btn inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-ivory-100 hover:bg-roseGold-300/30 text-slate-600 hover:text-emerald-950 border border-champagne-300/50 text-[11px] transition-all cursor-pointer"
            title="Send love to this blessing"
          >
            <span class="text-rose-500">♥</span>
            <span class="font-medium">${Number(w.likes || 1)}</span>
          </button>
        </div>
      </article>
    `;
  }

  function renderWishesMarquee() {
    if (!marqueeTrack) return;

    if (isLoadingWishes) {
      if (wishCountBadge) wishCountBadge.textContent = 'Loading Blessings...';
      marqueeTrack.innerHTML = `
        <div class="w-[86vw] max-w-md mx-auto bg-white/80 p-6 rounded-2xl border border-champagne-300/60 text-center text-slate-500 text-sm font-serif italic">
          Loading heartfelt blessings...
        </div>
      `;
      return;
    }

    if (wishCountBadge) {
      wishCountBadge.textContent = `${wishesData.length} Live Blessing${wishesData.length === 1 ? '' : 's'}`;
    }

    if (wishesData.length === 0) {
      marqueeTrack.innerHTML = `
        <div class="w-[88vw] max-w-md mx-auto bg-white p-7 rounded-2xl border border-champagne-300/70 shadow-md text-center">
          <p class="font-serif italic text-lg text-emerald-950 mb-1">Be the first to bless Aswin &amp; Athira ✨</p>
          <p class="text-xs text-slate-500 font-light">Tap "Add Your Blessing To The Stream" above to share your warm wishes.</p>
        </div>
      `;
      return;
    }

    // Repeat the set an even number of times (>= 2) so halfWidth seamless wrap always aligns
    const minCopies = Math.max(2, Math.ceil(6 / wishesData.length));
    const evenCopies = minCopies % 2 === 0 ? minCopies : minCopies + 1;
    const singleSetHtml = wishesData.map(createWishCardHtml).join('');
    marqueeTrack.innerHTML = singleSetHtml.repeat(evenCopies);
  }

  async function fetchWishesFromSupabase(preserveScroll = false) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/wishes?select=id,name,relation,location,message,likes,created_at&order=created_at.desc&limit=60`,
        {
          method: 'GET',
          headers: SUPABASE_HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch wishes (${response.status})`);
      }

      const rows = await response.json();
      wishesData = Array.isArray(rows) ? rows : [];
      isLoadingWishes = false;

      const prevScroll = preserveScroll && marqueeContainer ? marqueeContainer.scrollLeft : 0;
      renderWishesMarquee();
      if (preserveScroll && marqueeContainer) {
        marqueeContainer.scrollLeft = prevScroll;
      }
    } catch (err) {
      console.error('Supabase fetch wishes error:', err);
      isLoadingWishes = false;
      renderWishesMarquee();
    }
  }

  renderWishesMarquee();
  fetchWishesFromSupabase(false);

  // Refresh live blessings periodically when tab is visible
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchWishesFromSupabase(true);
    }
  }, 30000);

  // Interactive Manual Scroll + Smooth Continuous Glide
  if (marqueeContainer && marqueeTrack) {
    let isHovered = false;
    let isPointerDragging = false;
    let hasDragged = false;
    let startPageX = 0;
    let startScrollLeft = 0;
    let manualCooldownUntil = 0;
    let scrollAccumulator = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function normalizeInfiniteScroll() {
      if (wishesData.length === 0) return;
      const halfWidth = marqueeTrack.scrollWidth / 2;
      if (halfWidth <= 0) return;
      if (marqueeContainer.scrollLeft >= halfWidth) {
        marqueeContainer.scrollLeft -= halfWidth;
      } else if (marqueeContainer.scrollLeft <= 0 && isPointerDragging) {
        marqueeContainer.scrollLeft += halfWidth;
      }
    }

    function autoGlideStep() {
      if (
        wishesData.length > 0 &&
        !prefersReducedMotion &&
        !isHovered &&
        !isPointerDragging &&
        Date.now() > manualCooldownUntil
      ) {
        scrollAccumulator += 0.55;
        if (scrollAccumulator >= 1) {
          const delta = Math.floor(scrollAccumulator);
          scrollAccumulator -= delta;
          marqueeContainer.scrollLeft += delta;
          normalizeInfiniteScroll();
        }
      }
      requestAnimationFrame(autoGlideStep);
    }

    requestAnimationFrame(autoGlideStep);

    marqueeContainer.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    marqueeContainer.addEventListener('mouseleave', () => {
      isHovered = false;
      if (isPointerDragging) {
        isPointerDragging = false;
        marqueeContainer.classList.remove('is-dragging');
      }
    });

    marqueeContainer.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isPointerDragging = true;
      hasDragged = false;
      startPageX = e.pageX;
      startScrollLeft = marqueeContainer.scrollLeft;
      marqueeContainer.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPointerDragging) return;
      const walk = e.pageX - startPageX;
      if (Math.abs(walk) > 4) hasDragged = true;
      marqueeContainer.scrollLeft = startScrollLeft - walk;
      normalizeInfiniteScroll();
    });

    window.addEventListener('mouseup', () => {
      if (isPointerDragging) {
        isPointerDragging = false;
        marqueeContainer.classList.remove('is-dragging');
        manualCooldownUntil = Date.now() + 900;
      }
    });

    marqueeContainer.addEventListener(
      'touchstart',
      () => {
        manualCooldownUntil = Date.now() + 2000;
      },
      { passive: true }
    );
    marqueeContainer.addEventListener(
      'touchmove',
      () => {
        manualCooldownUntil = Date.now() + 2000;
        normalizeInfiniteScroll();
      },
      { passive: true }
    );
    marqueeContainer.addEventListener(
      'wheel',
      () => {
        manualCooldownUntil = Date.now() + 1400;
        normalizeInfiniteScroll();
      },
      { passive: true }
    );

    marqueeTrack.addEventListener('click', async (e) => {
      if (hasDragged) {
        hasDragged = false;
        return;
      }
      const btn = e.target.closest('.wish-like-btn');
      if (!btn) return;
      const wishId = Number(btn.getAttribute('data-like-id'));
      const targetWish = wishesData.find((w) => Number(w.id) === wishId);
      if (!targetWish) return;

      // Optimistic UI update
      targetWish.likes = Number(targetWish.likes || 1) + 1;
      const prevScroll = marqueeContainer.scrollLeft;
      renderWishesMarquee();
      marqueeContainer.scrollLeft = prevScroll;
      showToast(`Sent love to ${targetWish.name}'s blessing ♥`, 'heart');

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_wish_likes`, {
          method: 'POST',
          headers: SUPABASE_HEADERS,
          body: JSON.stringify({ target_wish_id: wishId }),
        });
        if (res.ok) {
          const authoritativeLikes = await res.json();
          if (typeof authoritativeLikes === 'number' && authoritativeLikes > 0) {
            targetWish.likes = authoritativeLikes;
            const curScroll = marqueeContainer.scrollLeft;
            renderWishesMarquee();
            marqueeContainer.scrollLeft = curScroll;
          }
        }
      } catch (err) {
        console.error('Failed to increment wish likes:', err);
      }
    });
  }

  // =========================================================================
  // 8. DRAGGABLE & MOBILE-CENTERED "SEND BLESSING" DIALOG
  // =========================================================================
  const wishDialog = document.getElementById('draggable-wish-dialog');
  const wishBackdrop = document.getElementById('wish-modal-backdrop');
  const dialogHeader = document.getElementById('dialog-header');
  const dialogBody = document.getElementById('dialog-body');
  const closeWishDialogBtn = document.getElementById('close-wish-dialog-btn');
  const minimizeDialogBtn = document.getElementById('minimize-dialog-btn');
  const dialogWishForm = document.getElementById('dialog-wish-form');
  const dlgSuccessMsg = document.getElementById('dlg-success-msg');

  let isMinimized = false;

  function clearMobileDialogInlinePos() {
    if (!wishDialog) return;
    if (window.innerWidth < 640) {
      wishDialog.style.left = '';
      wishDialog.style.top = '';
      wishDialog.style.right = '';
      wishDialog.style.bottom = '';
    }
  }

  window.addEventListener('resize', clearMobileDialogInlinePos);

  function openWishDialog(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!wishDialog) return;

    clearMobileDialogInlinePos();

    if (isMinimized && dialogBody) {
      isMinimized = false;
      dialogBody.classList.remove('hidden');
    }

    if (wishBackdrop) {
      wishBackdrop.classList.remove('hidden');
      void wishBackdrop.offsetWidth;
      wishBackdrop.classList.add('is-open');
    }

    wishDialog.classList.remove('hidden');
    void wishDialog.offsetWidth;
    wishDialog.classList.add('is-open');

    if (window.innerWidth >= 640) {
      const nameInput = document.getElementById('dlg-name');
      if (nameInput) nameInput.focus();
    }
  }

  function closeWishDialog() {
    if (!wishDialog) return;
    wishDialog.classList.remove('is-open');
    if (wishBackdrop) {
      wishBackdrop.classList.remove('is-open');
    }

    setTimeout(() => {
      if (!wishDialog.classList.contains('is-open')) {
        wishDialog.classList.add('hidden');
        if (wishBackdrop) wishBackdrop.classList.add('hidden');
      }
    }, 230);
  }

  window.openWishDialog = openWishDialog;
  window.closeWishDialog = closeWishDialog;

  document.querySelectorAll('[data-open-wish]').forEach((btn) => {
    btn.removeAttribute('onclick');
    btn.addEventListener('click', openWishDialog);
  });

  if (wishBackdrop) {
    wishBackdrop.addEventListener('click', closeWishDialog);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wishDialog && !wishDialog.classList.contains('hidden')) {
      closeWishDialog();
    }
  });

  if (closeWishDialogBtn) {
    closeWishDialogBtn.addEventListener('click', closeWishDialog);
  }

  if (minimizeDialogBtn && dialogBody) {
    minimizeDialogBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      dialogBody.classList.toggle('hidden', isMinimized);
      minimizeDialogBtn.innerHTML = isMinimized
        ? '<i class="w-4 h-4" data-lucide="maximize-2"></i>'
        : '<i class="w-4 h-4" data-lucide="minus"></i>';
      refreshIcons();
    });
  }

  // Quick Blessing Suggestion Chips
  document.querySelectorAll('.blessing-chip-btn').forEach((chip) => {
    chip.addEventListener('click', () => {
      const msgArea = document.getElementById('dlg-message');
      const sample = chip.getAttribute('data-blessing');
      if (msgArea && sample) {
        msgArea.value = sample;
        msgArea.focus();
      }
    });
  });

  // Mouse & Touch Drag Implementation (Desktop >= 640px)
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  if (dialogHeader && wishDialog) {
    dialogHeader.addEventListener('mousedown', (e) => {
      if (window.innerWidth < 640 || e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = wishDialog.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      wishDialog.style.right = 'auto';
      wishDialog.style.bottom = 'auto';
      wishDialog.style.left = `${initialLeft}px`;
      wishDialog.style.top = `${initialTop}px`;
      wishDialog.style.transition = 'none';
      wishDialog.classList.add('dragging');
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxLeft = Math.max(12, window.innerWidth - wishDialog.offsetWidth - 12);
      const maxTop = Math.max(12, window.innerHeight - 72);
      wishDialog.style.left = `${Math.max(12, Math.min(maxLeft, initialLeft + dx))}px`;
      wishDialog.style.top = `${Math.max(12, Math.min(maxTop, initialTop + dy))}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        wishDialog.style.transition = '';
        wishDialog.classList.remove('dragging');
        document.body.style.userSelect = '';
      }
    });

    dialogHeader.addEventListener(
      'touchstart',
      (e) => {
        if (window.innerWidth < 640 || e.target.closest('button')) return;
        const touch = e.touches[0];
        isDragging = true;
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = wishDialog.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        wishDialog.style.right = 'auto';
        wishDialog.style.bottom = 'auto';
        wishDialog.style.left = `${initialLeft}px`;
        wishDialog.style.top = `${initialTop}px`;
        wishDialog.style.transition = 'none';
      },
      { passive: true }
    );

    document.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        const maxLeft = Math.max(8, window.innerWidth - wishDialog.offsetWidth - 8);
        const maxTop = Math.max(8, window.innerHeight - 72);
        wishDialog.style.left = `${Math.max(8, Math.min(maxLeft, initialLeft + dx))}px`;
        wishDialog.style.top = `${Math.max(8, Math.min(maxTop, initialTop + dy))}px`;
      },
      { passive: true }
    );

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        wishDialog.style.transition = '';
      }
    });

    dialogHeader.addEventListener('dblclick', () => {
      if (window.innerWidth < 640) return;
      wishDialog.style.left = '';
      wishDialog.style.top = '';
      wishDialog.style.right = '';
      wishDialog.style.bottom = '';
    });
  }

  // Handle New Blessing Submission -> Inserts Directly into Supabase `public.wishes`
  let isSubmittingWish = false;
  if (dialogWishForm) {
    dialogWishForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmittingWish) return;

      const nameInput = document.getElementById('dlg-name');
      const relationInput = document.getElementById('dlg-relationship');
      const locationInput = document.getElementById('dlg-location');
      const messageInput = document.getElementById('dlg-message');
      const submitBtn = dialogWishForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const relation = relationInput ? relationInput.value : 'Friend of Couple';
      const location =
        locationInput && locationInput.value.trim()
          ? locationInput.value.trim()
          : 'Wedding Guestbook';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) return;

      isSubmittingWish = true;
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-wait');
        submitBtn.innerHTML = '<span>Posting Blessing...</span>';
      }

      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/wishes`, {
          method: 'POST',
          headers: {
            ...SUPABASE_HEADERS,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            name,
            relation,
            location,
            message,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to save blessing (${res.status})`);
        }

        const insertedRows = await res.json();
        const savedRow =
          Array.isArray(insertedRows) && insertedRows[0]
            ? insertedRows[0]
            : {
                id: Date.now(),
                name,
                relation,
                location,
                message,
                likes: 1,
                created_at: new Date().toISOString(),
              };

        sessionNewWishIds.add(Number(savedRow.id));
        wishesData.unshift(savedRow);
        renderWishesMarquee();
        if (marqueeContainer) {
          marqueeContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
        burstPetals(20);

        if (dlgSuccessMsg) dlgSuccessMsg.classList.remove('hidden');
        dialogWishForm.reset();
        showToast(`Thank you, ${name}! Your blessing is now live.`, 'sparkles');

        setTimeout(() => {
          if (dlgSuccessMsg) dlgSuccessMsg.classList.add('hidden');
          closeWishDialog();
          const wishesSection = document.getElementById('wishes');
          if (wishesSection) {
            wishesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1600);
      } catch (err) {
        console.error('Supabase insert wish error:', err);
        showToast('Could not post blessing. Please check your internet connection.', 'alert-circle');
      } finally {
        isSubmittingWish = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-75', 'cursor-wait');
          submitBtn.innerHTML = originalBtnHtml;
          refreshIcons();
        }
      }
    });
  }

  refreshIcons();
})();
