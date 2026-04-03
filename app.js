'use strict';

let filteredCompanies = [...companies];
let adminSessionUnlocked = false;
const MAX_TEXT_LENGTH = 500;
const ADMIN_CODE_STORAGE_KEY = 'stages_lille_admin_code';
const NIGHT_MODE_STORAGE_KEY = 'stages_lille_night_mode';
const MAX_ADMIN_ATTEMPTS = 5;
const ADMIN_LOCK_TIME_MS = 10 * 60 * 1000;
let adminFailedAttempts = 0;
let adminLockedUntil = 0;

const ui = {
    companiesGrid: document.getElementById('companies-grid'),
    resultsCount: document.getElementById('results-count'),
    metroFilter: document.getElementById('metro-filter'),
    sectorFilter: document.getElementById('sector-filter'),
    searchInput: document.getElementById('search-input'),
    searchButton: document.getElementById('search-button'),
    companyModal: document.getElementById('company-modal'),
    modalBody: document.getElementById('modal-body'),
    modalClose: document.getElementById('modal-close-button'),
    adminPanel: document.getElementById('admin-panel'),
    adminClose: document.getElementById('admin-close-button'),
    nightModeToggle: document.getElementById('night-mode-toggle'),
    statsCompanies: document.getElementById('stats-companies'),
    statsMetros: document.getElementById('stats-metros'),
    statsSectors: document.getElementById('stats-sectors'),
    adminKpiGrid: document.getElementById('admin-kpi-grid'),
    adminSectorBars: document.getElementById('admin-sector-bars'),
    adminCompanyList: document.getElementById('admin-company-list')
};

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function sanitizeText(value, maxLength = MAX_TEXT_LENGTH) {
    return String(value || '').trim().slice(0, maxLength);
}

function normalizeLines(value) {
    return String(value || '')
        .split('\n')
        .map(item => sanitizeText(item, 140))
        .filter(Boolean);
}

function safePhoneHref(phone) {
    const safe = String(phone || '').replace(/[^\d+]/g, '');
    return safe ? `tel:${safe}` : '#';
}

function safeMailHref(email) {
    const safe = String(email || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe) ? `mailto:${safe}` : '#';
}

function populateSelectOptions() {
    sectorOptions.forEach(sector => {
        if (![...ui.sectorFilter.options].some(option => option.value === sector)) {
            ui.sectorFilter.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(sector)}">${escapeHtml(sector)}</option>`);
        }
    });

    metroOptions.forEach(metro => {
        if (![...ui.metroFilter.options].some(option => option.value === metro)) {
            ui.metroFilter.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(metro)}">${escapeHtml(metro)}</option>`);
        }
    });
}

function displayCompanies(companiesToDisplay) {
    if (companiesToDisplay.length === 0) {
        ui.companiesGrid.innerHTML = `
            <div class="empty-state empty-state-full">
                <div class="empty-state-icon">🔍</div>
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        ui.resultsCount.textContent = '0';
        return;
    }

    ui.resultsCount.textContent = String(companiesToDisplay.length);

    ui.companiesGrid.innerHTML = [...companiesToDisplay]
        .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
        .map(company => `
            <article class="company-card">
                <div class="company-header">
                    <div>
                        <h3 class="company-name">${company.isFeatured ? '⭐ ' : ''}${escapeHtml(company.name)}</h3>
                        <span class="company-sector">${escapeHtml(company.sector)}</span>
                    </div>
                </div>
                <div class="metro-info"><span class="metro-line">M</span><span>${escapeHtml(company.metro)}</span></div>
                <div class="company-address"><span>📍</span><span>${escapeHtml(company.address)}</span></div>
                <p class="company-description">${escapeHtml(company.description)}</p>
                <div class="company-meta">
                    <div class="meta-item"><span class="meta-icon">⏱️</span><span>${escapeHtml(company.duration)}</span></div>
                    <div class="meta-item"><span class="meta-icon">📧</span><span>Contact disponible</span></div>
                </div>
                <button class="btn-contact" data-action="open-details" data-company-id="${company.id}">Voir les détails →</button>
            </article>
        `).join('');
}

function filterCompanies() {
    const metroFilter = ui.metroFilter.value;
    const sectorFilter = ui.sectorFilter.value;
    const searchInput = ui.searchInput.value.toLowerCase();

    filteredCompanies = companies.filter(company => {
        const matchesMetro = !metroFilter || company.metro === metroFilter;
        const matchesSector = !sectorFilter || company.sector === sectorFilter;
        const matchesSearch = !searchInput || company.name.toLowerCase().includes(searchInput);
        return matchesMetro && matchesSector && matchesSearch;
    });

    displayCompanies(filteredCompanies);
}

function openModal(companyId) {
    const company = companies.find(c => c.id === Number(companyId));
    if (!company) return;

    ui.modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${escapeHtml(company.name)}</h2>
            <span class="company-sector">${escapeHtml(company.sector)}</span>
        </div>
        <div class="modal-section">
            <div class="metro-info"><span class="metro-line">M</span><span>${escapeHtml(company.metro)}</span></div>
            <div class="company-address company-address-modal"><span>📍</span><span>${escapeHtml(company.address)}</span></div>
        </div>
        <div class="modal-section"><h3>À propos</h3><p>${escapeHtml(company.description)}</p></div>
        <div class="modal-section"><h3>Ce que tu feras</h3><ul>${company.tasks.map(task => `<li>${escapeHtml(task)}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3>Ce qu'on attend de toi</h3><ul>${company.requirements.map(req => `<li>${escapeHtml(req)}</li>`).join('')}</ul></div>
        <div class="modal-section">
            <h3>Informations pratiques</h3>
            <p><strong>Durée :</strong> ${escapeHtml(company.duration)}</p>
            <p><strong>Horaires :</strong> ${escapeHtml(company.schedule)}</p>
        </div>
        <div class="contact-info">
            <h3 class="contact-title">Contact</h3>
            <div class="contact-item">
                <div class="contact-icon">📧</div>
                <div class="contact-details">
                    <div class="contact-label">Email</div>
                    <a href="${safeMailHref(company.email)}">${escapeHtml(company.email)}</a>
                </div>
            </div>
            <div class="contact-item">
                <div class="contact-icon">📞</div>
                <div class="contact-details">
                    <div class="contact-label">Téléphone</div>
                    <a href="${safePhoneHref(company.phone)}">${escapeHtml(company.phone)}</a>
                </div>
            </div>
        </div>
    `;

    ui.companyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function validateCompanyPayload(payload) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const requiredFields = ['name', 'sector', 'metro', 'address', 'description', 'duration', 'email', 'phone', 'schedule'];

    for (const field of requiredFields) {
        if (!payload[field]) return `Champ requis manquant : ${field}`;
    }

    if (!emailRegex.test(payload.email)) return 'Adresse email invalide.';
    if (payload.name.length < 2) return 'Le nom est trop court.';
    return null;
}

function openAddCompanyModal() {
    const metroInputs = metroOptions.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
    const sectorInputs = sectorOptions.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

    ui.modalBody.innerHTML = `
        <div class="modal-header"><h2 class="modal-title">Ajouter une organisation</h2></div>
        <div id="success-container"></div>
        <form id="add-company-form" novalidate>
            <div class="add-form-section"><label for="company-name">Nom de l'organisation *</label><input type="text" id="company-name" required maxlength="120"></div>
            <div class="form-row">
                <div class="add-form-section"><label for="company-sector">Secteur *</label><select id="company-sector" required><option value="">Choisir</option>${sectorInputs}</select></div>
                <div class="add-form-section"><label for="company-metro">Station de métro *</label><select id="company-metro" required><option value="">Choisir</option>${metroInputs}</select></div>
            </div>
            <div class="add-form-section"><label for="company-address">Adresse *</label><input type="text" id="company-address" required maxlength="180"></div>
            <div class="add-form-section"><label for="company-description">Description *</label><textarea id="company-description" required maxlength="500"></textarea></div>
            <div class="form-row">
                <div class="add-form-section"><label for="company-duration">Durée *</label><input type="text" id="company-duration" required maxlength="80"></div>
                <div class="add-form-section"><label for="company-schedule">Horaires *</label><input type="text" id="company-schedule" required maxlength="80"></div>
            </div>
            <div class="form-row">
                <div class="add-form-section"><label for="company-email">Email *</label><input type="email" id="company-email" required maxlength="120"></div>
                <div class="add-form-section"><label for="company-phone">Téléphone *</label><input type="tel" id="company-phone" required maxlength="40"></div>
            </div>
            <div class="add-form-section"><label for="company-tasks">Tâches (une par ligne)</label><textarea id="company-tasks" maxlength="1000"></textarea></div>
            <div class="add-form-section"><label for="company-requirements">Prérequis (une par ligne)</label><textarea id="company-requirements" maxlength="1000"></textarea></div>
            <button type="submit" class="btn-submit-company">Ajouter l'organisation</button>
        </form>
    `;

    const form = document.getElementById('add-company-form');
    form.addEventListener('submit', handleAddCompany);

    ui.companyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function handleAddCompany(event) {
    event.preventDefault();

    const payload = {
        id: Math.max(...companies.map(c => c.id), 0) + 1,
        name: sanitizeText(document.getElementById('company-name').value, 120),
        sector: sanitizeText(document.getElementById('company-sector').value, 80),
        metro: sanitizeText(document.getElementById('company-metro').value, 80),
        address: sanitizeText(document.getElementById('company-address').value, 180),
        description: sanitizeText(document.getElementById('company-description').value, 500),
        duration: sanitizeText(document.getElementById('company-duration').value, 80),
        email: sanitizeText(document.getElementById('company-email').value, 120),
        phone: sanitizeText(document.getElementById('company-phone').value, 40),
        schedule: sanitizeText(document.getElementById('company-schedule').value, 80),
        tasks: normalizeLines(document.getElementById('company-tasks').value),
        requirements: normalizeLines(document.getElementById('company-requirements').value),
        isFeatured: false
    };

    if (payload.tasks.length === 0) payload.tasks = ['Découverte des activités de l’entreprise'];
    if (payload.requirements.length === 0) payload.requirements = ['Motivation et ponctualité'];

    const validationError = validateCompanyPayload(payload);
    const successContainer = document.getElementById('success-container');

    if (validationError) {
        successContainer.innerHTML = `<div class="error-message">⚠️ ${escapeHtml(validationError)}</div>`;
        return;
    }

    if (!metroOptions.includes(payload.metro)) metroOptions.push(payload.metro);
    if (!sectorOptions.includes(payload.sector)) sectorOptions.push(payload.sector);

    companies.push(payload);
    filteredCompanies = [...companies];
    populateSelectOptions();
    displayCompanies(filteredCompanies);
    renderLandingStats();
    renderAdminDashboard();

    successContainer.innerHTML = '<div class="success-message">✅ Организация добавлена.</div>';
    event.target.reset();
}

function closeModal() {
    ui.companyModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getSectorBreakdown() {
    return companies.reduce((acc, company) => {
        acc[company.sector] = (acc[company.sector] || 0) + 1;
        return acc;
    }, {});
}

function renderAdminDashboard() {
    const uniqueMetros = new Set(companies.map(company => company.metro)).size;
    const featured = companies.filter(company => company.isFeatured).length;
    const averageTasks = companies.length
        ? (companies.reduce((sum, company) => sum + company.tasks.length, 0) / companies.length).toFixed(1)
        : '0.0';

    ui.adminKpiGrid.innerHTML = `
        <div class="admin-kpi"><div class="admin-kpi-label">Организаций</div><div class="admin-kpi-value">${companies.length}</div></div>
        <div class="admin-kpi"><div class="admin-kpi-label">Станций</div><div class="admin-kpi-value">${uniqueMetros}</div></div>
        <div class="admin-kpi"><div class="admin-kpi-label">Premium</div><div class="admin-kpi-value">${featured}</div></div>
        <div class="admin-kpi"><div class="admin-kpi-label">Задач/стажировка</div><div class="admin-kpi-value">${averageTasks}</div></div>
    `;

    const sectorBreakdown = getSectorBreakdown();
    const max = Math.max(...Object.values(sectorBreakdown), 1);
    ui.adminSectorBars.innerHTML = '<h3 class="admin-subtitle">По секторам</h3>' + Object.entries(sectorBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([sector, count]) => `<div class="sector-row"><span>${escapeHtml(sector)}</span><div class="sector-track"><div class="sector-fill" data-width="${(count / max) * 100}"></div></div><strong>${count}</strong></div>`)
        .join('');
    ui.adminSectorBars.querySelectorAll('.sector-fill').forEach(item => {
        const width = Number(item.dataset.width || 0);
        item.style.width = `${Math.min(Math.max(width, 0), 100)}%`;
    });

    ui.adminCompanyList.innerHTML = '<button class="admin-action add" data-action="add-company">+ Добавить организацию</button>' + companies.map(company => `
        <div class="admin-item">
            <div class="admin-item-head">
                <div class="admin-item-name">${company.isFeatured ? '⭐ ' : ''}${escapeHtml(company.name)}</div>
                <div class="admin-actions">
                    <button class="admin-action feature" data-action="toggle-feature" data-company-id="${company.id}">${company.isFeatured ? 'Убрать' : 'Premium'}</button>
                    <button class="admin-action delete" data-action="delete-company" data-company-id="${company.id}">Удалить</button>
                </div>
            </div>
            <div class="admin-note">${escapeHtml(company.sector)} • ${escapeHtml(company.metro)}</div>
        </div>
    `).join('');
}

function renderLandingStats() {
    const metros = new Set(companies.map(company => company.metro)).size;
    const sectors = new Set(companies.map(company => company.sector)).size;

    if (ui.statsCompanies) ui.statsCompanies.textContent = String(companies.length);
    if (ui.statsMetros) ui.statsMetros.textContent = String(metros);
    if (ui.statsSectors) ui.statsSectors.textContent = String(sectors);
}

function unlockAdmin() {
    if (adminSessionUnlocked) return true;
    const now = Date.now();
    if (now < adminLockedUntil) {
        const minutesLeft = Math.ceil((adminLockedUntil - now) / 60000);
        window.alert(`Доступ временно заблокирован. Повторите через ${minutesLeft} мин.`);
        return false;
    }

    const configuredPasscode = window.localStorage.getItem(ADMIN_CODE_STORAGE_KEY);
    if (!configuredPasscode) {
        window.alert('Админ-панель отключена. Для включения задайте localStorage ключ stages_lille_admin_code.');
        return false;
    }

    const pass = window.prompt('Введите код администратора:');
    if (!pass) return false;

    if (pass !== configuredPasscode) {
        adminFailedAttempts += 1;
        if (adminFailedAttempts >= MAX_ADMIN_ATTEMPTS) {
            adminLockedUntil = Date.now() + ADMIN_LOCK_TIME_MS;
            adminFailedAttempts = 0;
            window.alert('Слишком много попыток. Доступ временно заблокирован на 10 минут.');
            return false;
        }
        window.alert('Неверный код.');
        return false;
    }

    adminFailedAttempts = 0;
    adminSessionUnlocked = true;
    return true;
}

function toggleAdminPanel(forceState) {
    if (!unlockAdmin()) return;

    const shouldOpen = typeof forceState === 'boolean' ? forceState : !ui.adminPanel.classList.contains('active');
    ui.adminPanel.classList.toggle('active', shouldOpen);
    if (shouldOpen) renderAdminDashboard();
}

function toggleFeatured(companyId) {
    const company = companies.find(item => item.id === Number(companyId));
    if (!company) return;

    company.isFeatured = !company.isFeatured;
    displayCompanies(filteredCompanies);
    renderAdminDashboard();
}

function deleteCompany(companyId) {
    const index = companies.findIndex(item => item.id === Number(companyId));
    if (index === -1) return;
    if (!window.confirm('Удалить организацию? Это действие нельзя отменить.')) return;

    companies.splice(index, 1);
    filterCompanies();
    renderLandingStats();
    renderAdminDashboard();
}

function toggleNightMode() {
    const enabled = document.body.classList.toggle('night-mode');
    window.localStorage.setItem(NIGHT_MODE_STORAGE_KEY, enabled ? '1' : '0');
}

function initHiddenAdminShortcuts() {
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeModal();
            ui.adminPanel.classList.remove('active');
            return;
        }

        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
            toggleAdminPanel(true);
            return;
        }

    });
}

function handleCompanyGridClick(event) {
    const button = event.target.closest('[data-action="open-details"]');
    if (!button) return;

    openModal(button.dataset.companyId);
}

function handleAdminListClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const { action, companyId } = button.dataset;

    if (action === 'add-company') {
        openAddCompanyModal();
        return;
    }

    if (action === 'toggle-feature') {
        toggleFeatured(companyId);
        return;
    }

    if (action === 'delete-company') {
        deleteCompany(companyId);
    }
}

function initListeners() {
    ui.searchInput.addEventListener('input', filterCompanies);
    ui.metroFilter.addEventListener('change', filterCompanies);
    ui.sectorFilter.addEventListener('change', filterCompanies);
    ui.searchButton.addEventListener('click', filterCompanies);
    ui.nightModeToggle.addEventListener('click', toggleNightMode);
    ui.modalClose.addEventListener('click', closeModal);
    ui.adminClose.addEventListener('click', () => ui.adminPanel.classList.remove('active'));
    ui.companiesGrid.addEventListener('click', handleCompanyGridClick);
    ui.adminCompanyList.addEventListener('click', handleAdminListClick);

    ui.companyModal.addEventListener('click', event => {
        if (event.target === ui.companyModal) closeModal();
    });
}

function initApp() {
    const nightModeEnabled = window.localStorage.getItem(NIGHT_MODE_STORAGE_KEY) === '1';
    document.body.classList.toggle('night-mode', nightModeEnabled);
    populateSelectOptions();
    displayCompanies(filteredCompanies);
    renderLandingStats();
    initListeners();
    initHiddenAdminShortcuts();
}

initApp();
