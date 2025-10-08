const STORAGE_KEY = 'ecoverse_favorites_v1';
const DRAFT_KEY   = 'ecoverse_story_draft_v1';

// Sample article data — replace with your final content
const articles = [
  {
    id: 'a1',
    title: '5 Low-Cost Ways to Green Your Home',
    excerpt: 'Practical, cheap improvements that reduce energy and waste.',
    img: 'assets/img/article-1.jpg',
    tags: ['home','budget']
  },
  {
    id: 'a2',
    title: 'Solar Tech For Beginners',
    excerpt: 'A gentle intro to residential solar and ROI basics.',
    img: 'assets/img/article-2.jpg',
    tags: ['tech','solar']
  },
  {
    id: 'a3',
    title: 'Zero-Waste Kitchen Habits',
    excerpt: 'Simple swaps that cut waste and save money.',
    img: 'assets/img/article-3.jpg',
    tags: ['lifestyle','kitchen']
  }
];

/* ---------------------------
   Storage helpers
   --------------------------- */
function loadFavorites(){
  const raw = localStorage.getItem(STORAGE_KEY);
  try{
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('favorites parse error', e);
    return [];
  }
}

function saveFavorites(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function loadDraft(){
  const raw = localStorage.getItem(DRAFT_KEY);
  try{
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    console.error('draft parse error', e);
    return null;
  }
}

function saveDraft(draft){
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

/* ---------------------------
   Render functions (template literals only)
   --------------------------- */
function renderArticles(filter = ''){
  const container = document.querySelector('#articles-list');
  if(!container) return;

  const list = filter ? articles.filter(a => a.tags.includes(filter)) : articles;
  if(list.length === 0){
    container.innerHTML = `<p class="empty">No articles found.</p>`;
    return;
  }

  const favorites = loadFavorites();

  const html = list.map(a => {
    const isFav = favorites.includes(a.id);
    return `
      <article class="card" data-id="${a.id}">
        <img src="${a.img}" alt="${a.title}" loading="lazy" />
        <div class="card-body">
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <div class="meta">
            <button class="fav-btn" data-id="${a.id}" aria-pressed="${isFav}">
              ${isFav ? '★ Favorited' : '☆ Add to favorites'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = html;
}

/* ---------------------------
   Interaction helpers
   --------------------------- */
function toggleFavorite(id){
  let favs = loadFavorites();
  if(favs.includes(id)){
    favs = favs.filter(x => x !== id);
  } else {
    favs.push(id);
  }
  saveFavorites(favs);
  renderArticles(); // refresh
}

function attachArticleListeners(){
  const container = document.querySelector('#articles-list');
  if(!container) return;
  container.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if(!btn) return;
    const id = btn.dataset.id;
    toggleFavorite(id);
  });
}

/* ---------------------------
   Filter form
   --------------------------- */
function attachFilter(){
  const form = document.querySelector('#filter-form');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[name="tag"], input#tag');
    const tag = input ? input.value.trim() : '';
    renderArticles(tag);
  });

  const clear = document.querySelector('#clear-filter');
  if(clear){
    clear.addEventListener('click', ()=> {
      const input = form.querySelector('input[name="tag"], input#tag');
      if(input) input.value = '';
      renderArticles();
    });
  }
}

/* ---------------------------
   Community form: autosave draft + submit
   --------------------------- */
function attachCommunityForm(){
  const form = document.querySelector('#story-form');
  if(!form) return;

  // populate draft if exists
  const draft = loadDraft();
  if(draft){
    form.name.value  = draft.name || '';
    form.email.value = draft.email || '';
    form.title.value = draft.title || '';
    form.story.value = draft.story || '';
  }

  // Save draft button
  const saveBtn = document.querySelector('#save-draft');
  if(saveBtn){
    saveBtn.addEventListener('click', () => {
      const payload = {
        name: form.name.value,
        email: form.email.value,
        title: form.title.value,
        story: form.story.value,
        savedAt: new Date().toISOString()
      };
      saveDraft(payload);
      const msg = document.querySelector('#form-message');
      if(msg) msg.textContent = 'Draft saved locally.';
    });
  }

  // Submit handler (simple client-side validation)
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!form.name.value || !form.email.value || !form.story.value){
      const msg = document.querySelector('#form-message');
      if(msg) msg.textContent = 'Please complete required fields.';
      return;
    }

    // fake submit: store in localStorage 'submitted_stories' array
    const submitted = JSON.parse(localStorage.getItem('ecoverse_submissions') || '[]');
    submitted.push({
      id: `s_${Date.now()}`,
      name: form.name.value,
      email: form.email.value,
      title: form.title.value,
      story: form.story.value,
      date: new Date().toISOString()
    });
    localStorage.setItem('ecoverse_submissions', JSON.stringify(submitted));
    localStorage.removeItem(DRAFT_KEY);

    form.reset();
    const msg = document.querySelector('#form-message');
    if(msg) msg.textContent = 'Thank you — your story was submitted locally.';
  });
}

/* ---------------------------
   Header: toggle nav on mobile
   --------------------------- */
function attachNavToggle(){
  const t = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  if(!t || !navList) return;
  t.addEventListener('click', () => {
    const expanded = t.getAttribute('aria-expanded') === 'true';
    t.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      navList.style.display = 'flex';
    } else {
      navList.style.display = '';
    }
  });
}

/* ---------------------------
   Utility: set years in footers
   --------------------------- */
function setFooterYears(){
  const y = new Date().getFullYear();
  const spans = document.querySelectorAll('#year,#year-2,#year-3,#year-4');
  spans.forEach(s => {
    if(s) s.textContent = y;
  });
}

/* ---------------------------
   Init
   --------------------------- */
function init(){
  renderArticles();
  attachArticleListeners();
  attachFilter();
  attachCommunityForm();
  attachNavToggle();
  setFooterYears();
  // additional safety: log if there are no images (development)
  // console.log('init complete');
}

/* Run init */
init();
