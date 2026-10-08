// ======================================================
//  Casos Criminales — navegación por pestañas + filtros
// ======================================================

// ---- Referencias al DOM (se declaran primero) ----
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('[data-nav]');
const tabButtons = document.querySelectorAll('.navlinks button, .mobile-menu button');
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

const filterButtons = document.querySelectorAll('.filter-btn');
const caseCards = document.querySelectorAll('#casosGrid .case-card');
const activeFilter = document.getElementById('activeFilter');
const activeFilterLabel = document.getElementById('activeFilterLabel');
const emptyMsg = document.getElementById('emptyMsg');

const CAT_LABELS = {
  sinresolver: 'Sin resolver',
  organizado: 'Crimen organizado',
  perfiles: 'Perfiles criminales',
  forense: 'Análisis forense',
  historias: 'Historias reales'
};
const filters = { status: 'todos', cat: 'todas' };

// ---- Navegación entre vistas (con hash en la URL) ----
function goTo(name){
  if(name === 'suscribete-scroll'){
    document.getElementById('suscribete').scrollIntoView({behavior:'smooth'});
    return;
  }
  const target = document.querySelector('.view[data-view="' + name + '"]');
  if(!target) return;

  views.forEach(v => v.classList.toggle('active', v === target));
  // Las páginas de cada expediente mantienen resaltada la pestaña "Casos"
  const tab = name.startsWith('caso-') ? 'casos' : name;
  tabButtons.forEach(b => b.classList.toggle('active', b.dataset.nav === tab));

  window.scrollTo({top:0, behavior:'instant'});
  try { history.replaceState(null, '', '#' + name); } catch(e) { /* algunos navegadores bloquean esto en file:// */ }
  mobileMenu.classList.remove('open');
  burgerBtn.setAttribute('aria-expanded', 'false');
}

navButtons.forEach(el => {
  el.addEventListener('click', () => goTo(el.dataset.nav));
  el.addEventListener('keydown', e => {
    if((e.key === 'Enter' || e.key === ' ') && el.getAttribute('role') === 'button'){
      e.preventDefault(); goTo(el.dataset.nav);
    }
  });
});

// ---- Menú móvil ----
burgerBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burgerBtn.setAttribute('aria-expanded', open);
});

// ---- Filtros dentro de "Casos" (estado + categoría) ----
function applyFilters(){
  let visible = 0;
  caseCards.forEach(card => {
    const okStatus = filters.status === 'todos' || card.dataset.status === filters.status;
    const cats = (card.dataset.cat || '').split(' ');
    const okCat = filters.cat === 'todas' || cats.includes(filters.cat);
    const show = okStatus && okCat;
    card.style.display = show ? 'flex' : 'none';
    if(show) visible++;
  });
  filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === filters.status));
  activeFilter.hidden = filters.cat === 'todas';
  activeFilterLabel.textContent = CAT_LABELS[filters.cat] || '';
  emptyMsg.hidden = visible > 0;
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.status = btn.dataset.filter;
    applyFilters();
  });
});

document.getElementById('clearCat').addEventListener('click', () => {
  filters.cat = 'todas';
  applyFilters();
});

// Clic en una categoría (pestaña Categorías o chips dentro de un expediente)
document.querySelectorAll('[data-cat-filter]').forEach(el => {
  const apply = () => {
    filters.cat = el.dataset.catFilter;
    filters.status = 'todos';
    applyFilters();
    goTo('casos');
  };
  el.addEventListener('click', apply);
  el.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); apply(); }
  });
});

// ---- Carga inicial según el hash de la URL ----
const startView = (location.hash || '#inicio').replace('#', '');
goTo(document.querySelector('.view[data-view="' + startView + '"]') ? startView : 'inicio');
applyFilters();