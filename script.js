const engines = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    yahoo: 'https://search.yahoo.com/search?p='
};

let currentEngine = 'google';

document.querySelectorAll('.engine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.engine-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentEngine = btn.dataset.engine;
    });
});

document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = engines[currentEngine] + encodeURIComponent(query);
    }
});

// --- Favorites ---
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function renderFavorites() {
    const list = document.getElementById('favList');
    list.innerHTML = '';
    const favs = getFavorites();
    favs.forEach((fav, index) => {
        const a = document.createElement('a');
        a.className = 'fav-item';
        a.href = fav.url;
        a.title = fav.name;
        a.textContent = fav.name.substring(0, 2).toUpperCase();

        const del = document.createElement('button');
        del.className = 'fav-delete';
        del.textContent = '\u00d7';
        del.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const updated = getFavorites().filter((_, i) => i !== index);
            saveFavorites(updated);
            renderFavorites();
        });
        a.appendChild(del);
        list.appendChild(a);
    });
}

// Modal
document.getElementById('favAddBtn').addEventListener('click', () => {
    document.getElementById('favName').value = '';
    document.getElementById('favUrl').value = '';
    document.getElementById('favModal').classList.add('show');
    document.getElementById('favName').focus();
});

document.getElementById('favCancel').addEventListener('click', () => {
    document.getElementById('favModal').classList.remove('show');
});

document.getElementById('favSave').addEventListener('click', () => {
    const name = document.getElementById('favName').value.trim();
    let url = document.getElementById('favUrl').value.trim();
    if (!name || !url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    const favs = getFavorites();
    favs.push({ name, url });
    saveFavorites(favs);
    renderFavorites();
    document.getElementById('favModal').classList.remove('show');
});

document.getElementById('favModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('favModal')) {
        document.getElementById('favModal').classList.remove('show');
    }
});

renderFavorites();

// --- Pause video when tab is not visible (hemat memory) ---
const video = document.getElementById('video-bg');
if (video) {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            video.pause();
        } else {
            video.play();
        }
    });
}
