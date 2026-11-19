/**
 * Ananya & Kabir — The Royal Wedding Celebration
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
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background transition
    if (navbar) {
      if (scrollY > 60) {
        navbar.classList.add(
          'bg-emerald-950/95',
          'backdrop-blur-xl',
          'shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
          'py-3.5',
          'border-b',
          'border-champagne-500/20'
        );
        navbar.classList.remove('py-5', 'bg-gradient-to-b', 'from-emerald-950/80', 'to-transparent');
      } else {
        navbar.classList.remove(
          'bg-emerald-950/95',
          'backdrop-blur-xl',
          'shadow-[0_10px_30px_rgba(0,0,0,0.45)]',
          'py-3.5',
          'border-b',
          'border-champagne-500/20'
        );
        navbar.classList.add('py-5', 'bg-gradient-to-b', 'from-emerald-950/80', 'to-transparent');
      }
    }

    // Top scroll progress bar
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      scrollProgress.style.width = `${pct}%`;
    }

    // Active section scroll spy
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

  // Mobile Menu Drawer Toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    mobileMenu.querySelectorAll('a, button').forEach((item) => {
      item.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 2. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // =========================================================================
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -35px 0px',
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

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

  // Initial subtle petals
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
        showToast('Falling marigold & rose petals paused', 'Pause');
      } else {
        burstPetals(10);
        showToast('Falling marigold & rose petals resumed', 'sparkles');
      }
    });
  }

  // =========================================================================
  // 4. WEB AUDIO API ROYAL AMBIENT CHIME / TANPURA HARMONIC SYNTHESIZER
  // =========================================================================
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const audioLabel = document.getElementById('audio-label');
  let audioCtx = null;
  let isPlayingAudio = false;
  let chimeInterval = null;
  let masterGain = null;

  // Raag Yaman / Royal Major Pentatonic frequencies (Hz)
  const royalNotes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  function playGentleChimeNote() {
    if (!audioCtx || !isPlayingAudio || !masterGain) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    const freq = royalNotes[Math.floor(Math.random() * royalNotes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.035, now + 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 4.0);
  }

  function toggleAmbientAudio() {
    if (!isPlayingAudio) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        showToast('Web Audio is not supported on this browser', 'volume-x');
        return;
      }
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);

        // Warm low drone (Sa & Pa)
        [130.81, 196.0].forEach((droneFreq) => {
          const droneOsc = audioCtx.createOscillator();
          const droneGain = audioCtx.createGain();
          droneOsc.type = 'sine';
          droneOsc.frequency.value = droneFreq;
          droneGain.gain.value = 0.012;
          droneOsc.connect(droneGain);
          droneGain.connect(masterGain);
          droneOsc.start();
        });
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isPlayingAudio = true;
      if (masterGain) {
        masterGain.gain.setTargetAtTime(0.6, audioCtx.currentTime, 0.3);
      }
      playGentleChimeNote();
      chimeInterval = setInterval(playGentleChimeNote, 2400);

      if (toggleAudioBtn) toggleAudioBtn.classList.add('playing', 'border-champagne-400');
      if (audioLabel) audioLabel.textContent = 'Chimes On';
      showToast('Royal Udaipur ambient chimes enabled', 'music');
    } else {
      isPlayingAudio = false;
      if (chimeInterval) {
        clearInterval(chimeInterval);
        chimeInterval = null;
      }
      if (masterGain && audioCtx) {
        masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.25);
      }
      if (toggleAudioBtn) toggleAudioBtn.classList.remove('playing', 'border-champagne-400');
      if (audioLabel) audioLabel.textContent = 'Royal Audio';
      showToast('Ambient chimes muted', 'volume-x');
    }
  }

  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener('click', toggleAmbientAudio);
  }

  // =========================================================================
  // 5. REAL-TIME LUXURY COUNTDOWN TIMER
  //    Target: Dec 11, 2026 10:30:00 IST (UTC+5:30)
  // =========================================================================
  let targetWeddingDate = new Date('2026-12-11T10:30:00+05:30').getTime();

  // Smart future fallback if ever viewed past Dec 11, 2026
  if (targetWeddingDate <= Date.now()) {
    const nextYear = new Date().getFullYear() + 1;
    targetWeddingDate = new Date(`${nextYear}-12-11T10:30:00+05:30`).getTime();
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
  // 6. INTERACTIVE LOVE STORY TIMELINE CHAPTERS
  // =========================================================================
  const storyChapters = [
    {
      id: 'mumbai',
      year: 'Monsoon 2021',
      place: 'Kala Ghoda, South Mumbai',
      title: 'A Serendipitous First Coffee',
      quote:
        'What began as taking shelter from a sudden Mumbai downpour over artisanal filter coffee turned into a four-hour conversation about architecture, old Bollywood classics, and our shared love for travelling off the beaten path.',
      highlight: 'Chapter I • Where It All Began',
    },
    {
      id: 'continents',
      year: 'Autumn 2023',
      place: 'London & Mumbai',
      title: 'Stargazing Across Continents',
      quote:
        'Through time zones, late-night FaceTime dinners, and handwritten postcards tucked into carry-on luggage, distance only deepened our certainty that home was never a place—it was always each other.',
      highlight: 'Chapter II • Love Across Miles',
    },
    {
      id: 'proposal',
      year: 'Winter 2025',
      place: 'Lake Pichola, Udaipur',
      title: 'Beneath A Thousand Floating Diyas',
      quote:
        'On a quiet boat gliding across Lake Pichola at twilight, Kabir asked the question that changed our lives forever. Surrounded by the golden reflection of Mewari palaces, Ananya said yes before the ring box even opened.',
      highlight: 'Chapter III • The Forever Promise',
    },
    {
      id: 'wedding',
      year: 'December 11 – 12, 2026',
      place: 'The Oberoi Udaivilas, Udaipur',
      title: 'Stepping Into Our Sacred Union',
      quote:
        'Now, we return to the very lake where we promised forever—surrounded by the warmth, blessings, and joyful laughter of the family and friends who shaped our lives.',
      highlight: 'Chapter IV • The Royal Celebration',
    },
  ];

  const storyTabs = document.querySelectorAll('.story-tab-btn');
  const storyTitleEl = document.getElementById('story-chapter-title');
  const storyQuoteEl = document.getElementById('story-chapter-quote');
  const storyMetaEl = document.getElementById('story-chapter-meta');
  const storyBadgeEl = document.getElementById('story-chapter-badge');
  const storyCardEl = document.getElementById('story-chapter-card');

  storyTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const chapterId = btn.getAttribute('data-chapter');
      const chapter = storyChapters.find((c) => c.id === chapterId);
      if (!chapter) return;

      storyTabs.forEach((b) => {
        b.classList.remove(
          'bg-emerald-950',
          'text-champagne-300',
          'border-emerald-950',
          'shadow-md'
        );
        b.classList.add('bg-white/80', 'text-slate-700', 'border-champagne-300/60');
      });
      btn.classList.remove('bg-white/80', 'text-slate-700', 'border-champagne-300/60');
      btn.classList.add('bg-emerald-950', 'text-champagne-300', 'border-emerald-950', 'shadow-md');

      if (storyCardEl) {
        storyCardEl.style.opacity = '0.4';
        storyCardEl.style.transform = 'translateY(6px)';
        setTimeout(() => {
          if (storyBadgeEl) storyBadgeEl.textContent = chapter.highlight;
          if (storyTitleEl) storyTitleEl.textContent = chapter.title;
          if (storyQuoteEl) storyQuoteEl.textContent = `"${chapter.quote}"`;
          if (storyMetaEl) storyMetaEl.textContent = `${chapter.year} • ${chapter.place}`;
          storyCardEl.style.opacity = '1';
          storyCardEl.style.transform = 'translateY(0)';
        }, 160);
      }
    });
  });

  // =========================================================================
  // 7. CEREMONIES SCHEDULE FILTER, SWATCHES & CALENDAR (.ICS) EXPORT
  // =========================================================================
  const scheduleFilterBtns = document.querySelectorAll('.schedule-filter-btn');
  const eventCards = document.querySelectorAll('.ceremony-card');

  scheduleFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-day');

      scheduleFilterBtns.forEach((b) => {
        b.classList.remove('bg-champagne-500', 'text-emerald-950', 'font-semibold', 'shadow-lg');
        b.classList.add('bg-emerald-900/50', 'text-ivory-200', 'border-champagne-400/30');
      });
      btn.classList.remove('bg-emerald-900/50', 'text-ivory-200', 'border-champagne-400/30');
      btn.classList.add('bg-champagne-500', 'text-emerald-950', 'font-semibold', 'shadow-lg');

      eventCards.forEach((card) => {
        const cardDay = card.getAttribute('data-day');
        if (filter === 'all' || cardDay === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Interactive Dress Code Swatch Preview
  document.querySelectorAll('.swatch-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const tipText = pill.getAttribute('data-tip');
      const colorHex = pill.getAttribute('data-color');
      const parentCard = pill.closest('.ceremony-card');
      if (!parentCard) return;

      parentCard.querySelectorAll('.swatch-pill').forEach((p) => p.classList.remove('active-swatch'));
      pill.classList.add('active-swatch');

      const tipBox = parentCard.querySelector('.swatch-tip-box');
      const tipDot = parentCard.querySelector('.swatch-tip-dot');
      const tipLabel = parentCard.querySelector('.swatch-tip-label');
      if (tipBox && tipLabel) {
        tipBox.classList.remove('hidden');
        tipLabel.textContent = tipText;
        if (tipDot && colorHex) {
          tipDot.style.backgroundColor = colorHex;
        }
      }
    });
  });

  // Add to Calendar (.ICS generator)
  const calendarEvents = {
    all: {
      title: 'Ananya & Kabir — The Royal Wedding Celebration',
      start: '20261211T050000Z',
      end: '20261212T180000Z',
      location: 'The Oberoi Udaivilas, Haridas Ji Ki Magri, Udaipur, Rajasthan 313001, India',
      description:
        'Celebration Itinerary at The Oberoi Udaivilas, Udaipur:\\n- Dec 11 (10:30 AM): The Haldi Utsav at The Marigold Courtyard\\n- Dec 11 (7:00 PM): The Grand Sangeet at Royal Grand Ballroom\\n- Dec 12 (4:30 PM): The Wedding Vows at Sunset Lakeside Promenade',
      filename: 'Ananya-Kabir-Wedding-Udaipur.ics',
    },
    haldi: {
      title: 'Ananya & Kabir — The Haldi Utsav',
      start: '20261211T050000Z',
      end: '20261211T083000Z',
      location: 'The Marigold Courtyard, The Oberoi Udaivilas, Udaipur',
      description:
        'A vibrant morning of golden turmeric, marigold petals, and joyful blessings. Dress Code: Sunshine Yellow, Festive Mustard & Warm Marigold.',
      filename: 'Ananya-Kabir-Haldi-Utsav.ics',
    },
    sangeet: {
      title: 'Ananya & Kabir — The Grand Sangeet Gala',
      start: '20261211T133000Z',
      end: '20261211T183000Z',
      location: 'Royal Grand Ballroom, The Oberoi Udaivilas, Udaipur',
      description:
        'An unforgettable evening gala beneath sparkling fairy lights featuring family dance battles and cocktails. Dress Code: Royal Emerald, Deep Sapphire & Metallic Gold.',
      filename: 'Ananya-Kabir-Grand-Sangeet.ics',
    },
    wedding: {
      title: 'Ananya & Kabir — Sacred Wedding Vows & Pheras',
      start: '20261212T110000Z',
      end: '20261212T180000Z',
      location: 'Sunset Lakeside Promenade, The Oberoi Udaivilas, Udaipur',
      description:
        'Baraat (4:30 PM) followed by sacred Vedic Pheras at sunset (5:45 PM) overlooking Lake Pichola and Royal Dinner. Dress Code: Classic Ivory, Champagne Gold & Pastel Blush.',
      filename: 'Ananya-Kabir-Wedding-Vows.ics',
    },
  };

  function downloadCalendarEvent(eventKey) {
    const ev = calendarEvents[eventKey] || calendarEvents.all;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ananya & Kabir Wedding//The Oberoi Udaivilas//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${eventKey}-${Date.now()}@ananyakabirwedding.com`,
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

  // =========================================================================
  // 8. INTERACTIVE DESTINATION VENUE PAVILION DIRECTORY
  // =========================================================================
  const pavilionData = {
    marigold: {
      badge: 'Pavilion I • Day 01 Morning',
      locationLabel: 'The Marigold Courtyard • Udaivilas',
      title: 'The Marigold Courtyard',
      desc: 'An open-air Mewari sandstone courtyard framed by scalloped arches, fragrant frangipani trees, and cascading marigold tapestries for the Haldi Utsav.',
      img: 'assets/images/haldi-utsav.png',
      fallbackImg:
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      timing: 'Thursday, Dec 11, 2026 • 10:30 AM onwards',
      attire: 'Sunshine Yellow, Festive Mustard & Warm Marigold',
    },
    ballroom: {
      badge: 'Pavilion II • Day 01 Night',
      locationLabel: 'Royal Grand Ballroom • Udaivilas',
      title: 'Royal Grand Ballroom',
      desc: 'Adorned with hand-cut Belgian crystal chandeliers, gilded domes, and an acoustic stage beneath a canopy of fairy lights for the Grand Sangeet night.',
      img: 'assets/images/grand-sangeet.png',
      fallbackImg:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      timing: 'Thursday, Dec 11, 2026 • 07:00 PM onwards',
      attire: 'Royal Emerald, Deep Sapphire & Metallic Gold',
    },
    promenade: {
      badge: 'Pavilion III • Day 02 Sunset',
      locationLabel: 'Sunset Lakeside Promenade • Lake Pichola',
      title: 'Sunset Lakeside Promenade',
      desc: 'Overlooking the shimmering waters of Lake Pichola and the City Palace, where the sacred Vedic mandap glows with white roses, mogra, and brass diyas.',
      img: 'assets/images/wedding-mandap.png',
      fallbackImg:
        'https://images.unsplash.com/photo-1545232972-907670f1f696?auto=format&fit=crop&w=1200&q=85',
      timing: 'Friday, Dec 12, 2026 • Baraat 4:30 PM | Pheras 5:45 PM',
      attire: 'Classic Ivory, Champagne Gold & Pastel Blush',
    },
    overview: {
      badge: 'Official Wedding Venue',
      locationLabel: 'Lake Pichola, Udaipur',
      title: 'The Oberoi Udaivilas',
      desc: 'Surrounded by Mewari domes, reflection pools, and 50 acres of historic royal grounds overlooking Lake Pichola.',
      img: 'assets/images/udaivilas-palace.png',
      fallbackImg:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85',
      timing: 'December 11 – 12, 2026 • Full Resort Buyout',
      attire: '24/7 Royal Butler & Chauffeur Concierge Available',
    },
  };

  const pavilionItems = document.querySelectorAll('.pavilion-card-btn');
  const venueImg = document.getElementById('venue-showcase-img');
  const venueBadge = document.getElementById('venue-showcase-badge');
  const venueLocLabel = document.getElementById('venue-showcase-loc');
  const venueTitle = document.getElementById('venue-showcase-title');
  const venueDesc = document.getElementById('venue-showcase-desc');
  const venueTiming = document.getElementById('venue-showcase-timing');

  function selectPavilion(key) {
    const data = pavilionData[key] || pavilionData.overview;

    pavilionItems.forEach((item) => {
      if (item.getAttribute('data-pavilion') === key) {
        item.classList.add('ring-2', 'ring-champagne-500', 'bg-champagne-300/20');
      } else {
        item.classList.remove('ring-2', 'ring-champagne-500', 'bg-champagne-300/20');
      }
    });

    if (venueImg) {
      venueImg.style.opacity = '0.35';
      setTimeout(() => {
        venueImg.onerror = function () {
          this.onerror = null;
          this.src = data.fallbackImg;
        };
        venueImg.src = data.img;
        venueImg.style.opacity = '1';
      }, 150);
    }
    if (venueBadge) venueBadge.textContent = data.badge;
    if (venueLocLabel) venueLocLabel.textContent = data.locationLabel;
    if (venueTitle) venueTitle.textContent = data.title;
    if (venueDesc) venueDesc.textContent = data.desc;
    if (venueTiming) venueTiming.textContent = data.timing;
  }

  window.selectPavilion = selectPavilion;

  pavilionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-pavilion');
      selectPavilion(key);
    });
  });

  // Jump from schedule card to pavilion
  document.querySelectorAll('.locate-pavilion-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-pavilion');
      const venueSec = document.getElementById('venue');
      if (venueSec) {
        venueSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => selectPavilion(key), 450);
      }
    });
  });

  // Copy Venue Address Button
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addr =
        'The Oberoi Udaivilas, Haridas Ji Ki Magri, Mulla Talai, Udaipur, Rajasthan 313001, India';
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
  // 9. PHOTO GALLERY, CATEGORY FILTER, FULLSCREEN LIGHTBOX & DOWNLOAD
  // =========================================================================
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxZoomBtn = document.getElementById('lightbox-zoom-btn');

  let currentGalleryList = [...allGalleryItems];
  let currentLightboxIndex = 0;

  // Gallery Category Filter
  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');

      galleryFilterBtns.forEach((b) => {
        b.classList.remove('bg-champagne-500', 'text-emerald-950', 'font-semibold');
        b.classList.add('bg-emerald-900/50', 'text-ivory-200', 'border-champagne-400/30');
      });
      btn.classList.remove('bg-emerald-900/50', 'text-ivory-200', 'border-champagne-400/30');
      btn.classList.add('bg-champagne-500', 'text-emerald-950', 'font-semibold');

      currentGalleryList = [];
      allGalleryItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          item.classList.remove('hidden');
          currentGalleryList.push(item);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // High-Res Image Download Handler
  function triggerDownload(url, filename) {
    showToast(`Preparing high-res download: ${filename}...`, 'download');
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename || 'Ananya-Kabir-Wedding.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
        showToast(`Downloaded ${filename}`, 'check-circle');
      })
      .catch(() => {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = filename || 'Ananya-Kabir-Wedding.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  window.triggerDownload = triggerDownload;

  function renderLightboxSlide(index) {
    if (!currentGalleryList.length) return;
    currentLightboxIndex = (index + currentGalleryList.length) % currentGalleryList.length;
    const item = currentGalleryList[currentLightboxIndex];

    const imgEl = item.querySelector('img');
    const fullImgUrl = imgEl ? imgEl.currentSrc || imgEl.src : item.getAttribute('data-img');
    const title = item.getAttribute('data-title') || 'Cherished Moment';
    const desc = item.getAttribute('data-desc') || '';
    const categoryLabel = item.getAttribute('data-badge') || 'Royal Gallery';

    if (lightboxImg) {
      lightboxImg.classList.remove('zoomed');
      lightboxImg.style.opacity = '0.2';
      setTimeout(() => {
        lightboxImg.src = fullImgUrl;
        lightboxImg.style.opacity = '1';
      }, 100);
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCategory) lightboxCategory.textContent = categoryLabel;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentGalleryList.length}`;
    }
  }

  function openLightboxAt(item) {
    const idx = currentGalleryList.indexOf(item);
    renderLightboxSlide(idx >= 0 ? idx : 0);

    if (!lightboxModal) return;
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      lightboxModal.classList.add('opacity-100');
      lightboxModal.classList.remove('opacity-0');
    }, 15);
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('opacity-100');
    lightboxModal.classList.add('opacity-0');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      if (lightboxImg) {
        lightboxImg.classList.remove('zoomed');
      }
    }, 280);
  }

  allGalleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightboxAt(item));
  });

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxSlide(currentLightboxIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxSlide(currentLightboxIndex + 1);
    });
  }

  if (lightboxZoomBtn && lightboxImg) {
    lightboxZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.classList.toggle('zoomed');
    });
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.classList.toggle('zoomed');
    });
  }

  if (lightboxDownloadBtn) {
    lightboxDownloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = currentGalleryList[currentLightboxIndex];
      if (!item) return;
      const imgEl = item.querySelector('img');
      const url = imgEl ? imgEl.currentSrc || imgEl.src : item.getAttribute('data-img');
      const title = item.getAttribute('data-title') || 'Ananya-Kabir-Moment';
      const filename = `Ananya-Kabir-${title.replace(/\s+/g, '-')}.png`;
      triggerDownload(url, filename);
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.id === 'lightbox-stage') {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightboxSlide(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') renderLightboxSlide(currentLightboxIndex + 1);
  });

  // =========================================================================
  // 10. GUESTBOOK & SEAMLESS MARQUEE + DRAGGABLE "ADD A WISH" DIALOG
  // =========================================================================
  const STORAGE_KEY_WISHES = 'ananya_kabir_royal_wishes_v1';

  const defaultWishes = [
    {
      id: 'w-1',
      name: 'Devika & Arjun Singhania',
      relation: "Bride's Family",
      time: 'Just now',
      message:
        'Dearest Ananya & Kabir, may every sunset over Lake Pichola remind you both of how beautifully two souls can intertwine. Sending you all our prayers, warmth, and lifelong love!',
      location: 'Udaipur, Rajasthan',
      likes: 24,
      isNew: false,
    },
    {
      id: 'w-2',
      name: 'Vikramaditya Roy',
      relation: "Groom's Family",
      time: '2 hours ago',
      message:
        "Kabir, you found your match in the most wonderful person! Can't wait to rock the dance floor at the Sangeet night. Wishing you guys eternal smiles and adventures ahead!",
      location: 'Mumbai, India',
      likes: 19,
      isNew: false,
    },
    {
      id: 'w-3',
      name: 'Pooja & Kunal Shah',
      relation: 'Friend of Couple',
      time: 'Yesterday',
      message:
        'From college canteen debates to this glorious royal mandap—what an incredible love story to witness! Congratulations to the dream couple!',
      location: 'New York, USA',
      likes: 31,
      isNew: false,
    },
    {
      id: 'w-4',
      name: 'Dr. Meenakshi & Rajesh Sharma',
      relation: 'Well Wisher',
      time: '2 days ago',
      message:
        'Sada Suhagan Raho! May the Almighty bestow boundless health, prosperity, and serene harmony upon your newly built home.',
      location: 'New Delhi, India',
      likes: 27,
      isNew: false,
    },
    {
      id: 'w-5',
      name: 'Aditi & Siddharth Varma',
      relation: "Groom's Family",
      time: '3 days ago',
      message:
        'Witnessing the warmth and respect you share is inspiring. Here is to a lifetime of adventures and joyful sunsets at Udaipur!',
      location: 'London, UK',
      likes: 18,
      isNew: false,
    },
    {
      id: 'w-6',
      name: 'Rohan & Tanya Mehra',
      relation: 'Friend of Couple',
      time: '4 days ago',
      message:
        'Ananya, you make the most stunning bride Kabir could ever dream of! Cannot wait for the royal celebrations at Udaivilas.',
      location: 'Bengaluru, India',
      likes: 22,
      isNew: false,
    },
  ];

  let wishesData = [];
  let currentWishFilter = 'all';

  function loadWishes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          wishesData = parsed;
          return;
        }
      }
    } catch (_) {
      // ignore storage errors
    }
    wishesData = [...defaultWishes];
  }

  function saveWishes() {
    try {
      localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishesData));
    } catch (_) {
      // ignore storage errors
    }
  }

  const marqueeTrack = document.getElementById('marquee-track');
  const wishCountBadge = document.getElementById('wish-count-badge');
  const toggleMarqueeBtn = document.getElementById('toggle-marquee-btn');

  function createWishCardHtml(w) {
    const borderClass = w.isNew
      ? 'border-2 border-champagne-500 ring-4 ring-champagne-400/15'
      : 'border border-champagne-300/60';
    const timeBadge = w.isNew
      ? `<span class="text-[10px] text-emerald-800 font-semibold px-2.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-200">Just added</span>`
      : `<span class="text-[10px] text-slate-400 font-light">${escapeHtml(w.time)}</span>`;

    return `
      <article class="w-80 sm:w-96 flex-shrink-0 bg-white p-6 rounded-2xl ${borderClass} shadow-md hover:shadow-xl transition-all duration-300 hover:border-champagne-500 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between mb-3 gap-2">
            <div>
              <h5 class="font-serif text-lg font-semibold text-emerald-950 leading-snug">${escapeHtml(w.name)}</h5>
              <span class="text-[10px] uppercase tracking-wider text-champagne-600 font-sans font-semibold">${escapeHtml(w.relation)}</span>
            </div>
            ${timeBadge}
          </div>
          <p class="font-serif italic text-slate-700 text-base leading-relaxed mb-4">
            "${escapeHtml(w.message)}"
          </p>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-ivory-200">
          <div class="text-[11px] text-champagne-600 flex items-center gap-1.5 font-sans font-medium">
            <span>✨ ${escapeHtml(w.location || 'Royal Guestbook')}</span>
          </div>
          <button
            type="button"
            data-like-id="${escapeHtml(w.id)}"
            class="wish-like-btn inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-ivory-100 hover:bg-roseGold-300/30 text-slate-600 hover:text-emerald-950 border border-champagne-300/50 text-[11px] transition-all"
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

    const filtered = wishesData.filter((w) => {
      if (currentWishFilter === 'all') return true;
      if (currentWishFilter === 'family') {
        return w.relation.toLowerCase().includes('family');
      }
      if (currentWishFilter === 'friends') {
        return w.relation.toLowerCase().includes('friend');
      }
      return true;
    });

    if (wishCountBadge) {
      wishCountBadge.textContent = `${wishesData.length} Live Blessings`;
    }

    // Duplicate the cards twice so translateX(-50%) creates a seamless infinite loop
    const cardsHtml = filtered.map(createWishCardHtml).join('');
    marqueeTrack.innerHTML = cardsHtml + cardsHtml;
  }

  loadWishes();
  renderWishesMarquee();

  // Delegate Heart / Like reaction clicks inside marquee
  if (marqueeTrack) {
    marqueeTrack.addEventListener('click', (e) => {
      const btn = e.target.closest('.wish-like-btn');
      if (!btn) return;
      const wishId = btn.getAttribute('data-like-id');
      const targetWish = wishesData.find((w) => w.id === wishId);
      if (targetWish) {
        targetWish.likes = (targetWish.likes || 1) + 1;
        saveWishes();
        renderWishesMarquee();
        showToast(`Sent love to ${targetWish.name}'s blessing ♥`, 'heart');
      }
    });
  }

  // Guestbook Filter Buttons
  document.querySelectorAll('.wish-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentWishFilter = btn.getAttribute('data-filter') || 'all';
      document.querySelectorAll('.wish-filter-btn').forEach((b) => {
        b.classList.remove('bg-emerald-950', 'text-champagne-300');
        b.classList.add('bg-white', 'text-slate-600');
      });
      btn.classList.remove('bg-white', 'text-slate-600');
      btn.classList.add('bg-emerald-950', 'text-champagne-300');
      renderWishesMarquee();
    });
  });

  // Pause / Resume Marquee Stream Button
  let marqueePaused = false;
  if (toggleMarqueeBtn && marqueeTrack) {
    toggleMarqueeBtn.addEventListener('click', () => {
      marqueePaused = !marqueePaused;
      marqueeTrack.classList.toggle('paused', marqueePaused);
      toggleMarqueeBtn.innerHTML = marqueePaused
        ? '<i class="w-3.5 h-3.5" data-lucide="play"></i><span>Resume Stream</span>'
        : '<i class="w-3.5 h-3.5" data-lucide="pause"></i><span>Pause Stream</span>';
      refreshIcons();
    });
  }

  // =========================================================================
  // 11. DRAGGABLE & MINIMIZABLE FLOATING "ADD A WISH" DIALOG
  // =========================================================================
  const wishDialog = document.getElementById('draggable-wish-dialog');
  const dialogHeader = document.getElementById('dialog-header');
  const dialogBody = document.getElementById('dialog-body');
  const openWishDialogBtn = document.getElementById('open-wish-dialog-btn');
  const closeWishDialogBtn = document.getElementById('close-wish-dialog-btn');
  const minimizeDialogBtn = document.getElementById('minimize-dialog-btn');
  const dialogWishForm = document.getElementById('dialog-wish-form');
  const dlgSuccessMsg = document.getElementById('dlg-success-msg');

  let isMinimized = false;

  function openWishDialog() {
    if (!wishDialog) return;
    wishDialog.classList.remove('hidden');
    if (isMinimized && dialogBody) {
      isMinimized = false;
      dialogBody.classList.remove('hidden');
    }
    setTimeout(() => {
      wishDialog.classList.remove('opacity-0', 'scale-95');
      wishDialog.classList.add('opacity-100', 'scale-100');
      const nameInput = document.getElementById('dlg-name');
      if (nameInput) nameInput.focus();
    }, 15);
  }

  function closeWishDialog() {
    if (!wishDialog) return;
    wishDialog.classList.remove('opacity-100', 'scale-100');
    wishDialog.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      wishDialog.classList.add('hidden');
    }, 280);
  }

  window.openWishDialog = openWishDialog;
  window.closeWishDialog = closeWishDialog;

  if (openWishDialogBtn) {
    openWishDialogBtn.addEventListener('click', openWishDialog);
  }
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

  // Mouse & Touch Drag Implementation
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  if (dialogHeader && wishDialog) {
    dialogHeader.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
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

    // Touch Drag Support
    dialogHeader.addEventListener(
      'touchstart',
      (e) => {
        if (e.target.closest('button')) return;
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

    // Double-click header to reset position
    dialogHeader.addEventListener('dblclick', () => {
      wishDialog.style.left = 'auto';
      wishDialog.style.top = '14%';
      wishDialog.style.right = '4%';
    });
  }

  // Handle New Blessing Submission
  if (dialogWishForm) {
    dialogWishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('dlg-name');
      const relationInput = document.getElementById('dlg-relationship');
      const locationInput = document.getElementById('dlg-location');
      const messageInput = document.getElementById('dlg-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const relation = relationInput ? relationInput.value : 'Friend of Couple';
      const location =
        locationInput && locationInput.value.trim()
          ? locationInput.value.trim()
          : 'New Blessing Posted';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) return;

      const newWish = {
        id: `w-${Date.now()}`,
        name,
        relation,
        time: 'Just added',
        message,
        location,
        likes: 1,
        isNew: true,
      };

      wishesData.unshift(newWish);
      currentWishFilter = 'all';
      saveWishes();
      renderWishesMarquee();
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
      }, 1800);
    });
  }

  // Initialize icons on load
  refreshIcons();
})();
