// ---- Navegación real entre pestañas (SPA con hash) ----
  const views = document.querySelectorAll('.view');
  const navButtons = document.querySelectorAll('[data-nav]');
  const tabButtons = document.querySelectorAll('.navlinks button, .mobile-menu button');

  function goTo(name){
    if(name === 'suscribete-scroll'){
      document.getElementById('suscribete').scrollIntoView({behavior:'smooth'});
      return;
    }
    views.forEach(v => v.classList.toggle('active', v.dataset.view === name));
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.nav === name));
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
    history.replaceState(null, '', '#' + name);
    mobileMenu.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => goTo(btn.dataset.nav));
  });

  // Carga inicial según el hash de la URL
  const startView = (location.hash || '#inicio').replace('#','');
  if(['inicio','casos','categorias','sobre'].includes(startView)){
    goTo(startView);
  }

  // ---- Menú móvil ----
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burgerBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', open);
  });

  // ---- Filtros dentro de "Casos" ----
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('#casosGrid .case-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      caseCards.forEach(card => {
        card.style.display = (f === 'todos' || card.dataset.status === f) ? 'flex' : 'none';
      });
    });
  });