/* Техцентр — обновленный JavaScript (модалка + анимации + маска) */
(function () {
  'use strict';

  var WHATSAPP_PHONE = '79258900270';

  // --- 1. ЛОГИКА МОДАЛЬНОГО ОКНА ---
  var modal = document.getElementById('booking-modal');
  var form = document.getElementById('booking-form');
  if (!modal || !form) return;

  var nameInput = document.getElementById('bf-name');
  var phoneInput = document.getElementById('bf-phone');
  var serviceSelect = document.getElementById('bf-service');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () {
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('[data-open-modal]'),
    function (btn) { btn.addEventListener('click', openModal); }
  );

  Array.prototype.forEach.call(
    modal.querySelectorAll('[data-close-modal]'),
    function (el) { el.addEventListener('click', closeModal); }
  );

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // --- 2. МАСКА ДЛЯ ТЕЛЕФОНА ---
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      var x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + ') ' + (x[3] ? x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
    });
  }

  // --- 3. ОТПРАВКА ФОРМЫ ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var name = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var service = serviceSelect ? serviceSelect.value : '';

    var text =
      'Здравствуйте! Хочу записаться в техцентр.\n' +
      'Имя: ' + name + '\n' +
      'Телефон: ' + phone + '\n' +
      'Услуга: ' + service;

    var url = 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(text);

    var win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
      win.focus();
    } else {
      window.location.href = url;
    }

    form.reset();
    closeModal();
  });

  // --- 4. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (Intersection Observer) ---
  var observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Находим все элементы, которые нужно анимировать
  var elementsToReveal = document.querySelectorAll('.adv-card, .service-card, .gallery figure, .brands li, .contacts');
  
  elementsToReveal.forEach(function (el) {
    el.classList.add('reveal-on-scroll'); // Добавляем класс для начального скрытого состояния
    observer.observe(el);
  });

})();
