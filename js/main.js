(function () {
  'use strict';

  var WHATSAPP = '221778864141';

  // Header: shadow on scroll
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Pre-select formule / programme from the CTA buttons
  var selFormule = document.getElementById('formule');
  var selProgramme = document.getElementById('programme');
  document.querySelectorAll('[data-formule]').forEach(function (a) {
    a.addEventListener('click', function () { selFormule.value = a.dataset.formule; });
  });
  document.querySelectorAll('[data-programme]').forEach(function (a) {
    a.addEventListener('click', function () { selProgramme.value = a.dataset.programme; });
  });

  // Form -> WhatsApp
  var form = document.getElementById('form');
  var note = document.getElementById('formNote');
  var defaultNote = note.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nom = form.nom, tel = form.tel;
    var digits = tel.value.replace(/\D/g, '');
    var okNom = nom.value.trim().length >= 2;
    var okTel = digits.length >= 8;

    nom.classList.toggle('is-invalid', !okNom);
    tel.classList.toggle('is-invalid', !okTel);

    if (!okNom || !okTel) {
      note.textContent = 'Merci de renseigner votre nom et un numéro de téléphone valide.';
      note.classList.add('is-error');
      (okNom ? tel : nom).focus();
      return;
    }
    note.textContent = defaultNote;
    note.classList.remove('is-error');

    var lines = [
      'Bonjour Novaris, je souhaite m\'inscrire.',
      '',
      'Nom : ' + nom.value.trim(),
      'Téléphone : ' + tel.value.trim(),
      'Programme : ' + form.programme.value,
      'Formule : ' + form.formule.value,
      'Mode : ' + form.mode.value
    ];
    if (form.message.value.trim()) lines.push('Message : ' + form.message.value.trim());

    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
