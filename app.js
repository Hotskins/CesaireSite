let filteredCompanies = [...companies];
let adminKeyBuffer = '';

function populateSelectOptions() {
    const metroFilter = document.getElementById('metro-filter');
    const sectorFilter = document.getElementById('sector-filter');

    sectorOptions.forEach(sector => {
        if (![...sectorFilter.options].some(option => option.value === sector)) {
            sectorFilter.insertAdjacentHTML('beforeend', `<option value="${sector}">${sector}</option>`);
        }
    });

    metroOptions.forEach(metro => {
        if (![...metroFilter.options].some(option => option.value === metro)) {
            metroFilter.insertAdjacentHTML('beforeend', `<option value="${metro}">${metro}</option>`);
        }
    });
}

function displayCompanies(companiesToDisplay) {
    const grid = document.getElementById('companies-grid');
    const count = document.getElementById('results-count');

    if (companiesToDisplay.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        count.textContent = '0';
        return;
    }

    count.textContent = companiesToDisplay.length;

    grid.innerHTML = [...companiesToDisplay]
        .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
        .map(company => `
            <div class="company-card">
                <div class="company-header">
                    <div>
                        <h3 class="company-name">${company.isFeatured ? '⭐ ' : ''}${company.name}</h3>
                        <span class="company-sector">${company.sector}</span>
                    </div>
                </div>
                <div class="metro-info"><span class="metro-line">M</span><span>${company.metro}</span></div>
                <div class="company-address"><span>📍</span><span>${company.address}</span></div>
                <p class="company-description">${company.description}</p>
                <div class="company-meta">
                    <div class="meta-item"><span class="meta-icon">⏱️</span><span>${company.duration}</span></div>
                    <div class="meta-item"><span class="meta-icon">📧</span><span>Contact disponible</span></div>
                </div>
                <button class="btn-contact" onclick="openModal(${company.id})">Voir les détails →</button>
            </div>
        `).join('');
}

function filterCompanies() {
    const metroFilter = document.getElementById('metro-filter').value;
    const sectorFilter = document.getElementById('sector-filter').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    filteredCompanies = companies.filter(company => {
        const matchesMetro = !metroFilter || company.metro === metroFilter;
        const matchesSector = !sectorFilter || company.sector === sectorFilter;
        const matchesSearch = !searchInput || company.name.toLowerCase().includes(searchInput);
        return matchesMetro && matchesSector && matchesSearch;
    });

    displayCompanies(filteredCompanies);
}

function openModal(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;

    const modal = document.getElementById('company-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${company.name}</h2>
            <span class="company-sector">${company.sector}</span>
        </div>
        <div class="modal-section">
            <div class="metro-info"><span class="metro-line">M</span><span>${company.metro}</span></div>
            <div class="company-address" style="margin-top: 0.5rem;"><span>📍</span><span>${company.address}</span></div>
        </div>
        <div class="modal-section"><h3>À propos</h3><p>${company.description}</p></div>
        <div class="modal-section"><h3>Ce que tu feras</h3><ul>${company.tasks.map(task => `<li>${task}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3>Ce qu'on attend de toi</h3><ul>${company.requirements.map(req => `<li>${req}</li>`).join('')}</ul></div>
        <div class="modal-section"><h3>Informations pratiques</h3><p><strong>Durée :</strong> ${company.duration}</p><p><strong>Horaires :</strong> ${company.schedule}</p></div>
        <div class="contact-info">
            <h3 style="margin-bottom: 1rem;">Contact</h3>
            <div class="contact-item"><div class="contact-icon">📧</div><div class="contact-details"><div style="font-weight: 600;">Email</div><a href="mailto:${company.email}">${company.email}</a></div></div>
            <div class="contact-item"><div class="contact-icon">📞</div><div class="contact-details"><div style="font-weight: 600;">Téléphone</div><a href="tel:${company.phone}">${company.phone}</a></div></div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openAddCompanyModal() {
    const modal = document.getElementById('company-modal');
    const modalBody = document.getElementById('modal-body');

    const metroInputs = metroOptions.map(v => `<option value="${v}">${v}</option>`).join('');
    const sectorInputs = sectorOptions.map(v => `<option value="${v}">${v}</option>`).join('');

    modalBody.innerHTML = `
        <div class="modal-header"><h2 class="modal-title">Ajouter une organisation</h2></div>
        <div id="success-container"></div>
        <form id="add-company-form" onsubmit="handleAddCompany(event)">
            <div class="add-form-section"><label for="company-name">Nom de l'organisation *</label><input type="text" id="company-name" required></div>
            <div class="form-row">
                <div class="add-form-section"><label for="company-sector">Secteur *</label><select id="company-sector" required><option value="">Choisir</option>${sectorInputs}</select></div>
                <div class="add-form-section"><label for="company-metro">Station de métro *</label><select id="company-metro" required><option value="">Choisir</option>${metroInputs}</select></div>
            </div>
            <div class="add-form-section"><label for="company-address">Adresse *</label><input type="text" id="company-address" required></div>
            <div class="add-form-section"><label for="company-description">Description *</label><textarea id="company-description" required></textarea></div>
            <div class="form-row">
                <div class="add-form-section"><label for="company-duration">Durée *</label><input type="text" id="company-duration" required></div>
                <div class="add-form-section"><label for="company-schedule">Horaires *</label><input type="text" id="company-schedule" required></div>
            </div>
            <div class="form-row">
                <div class="add-form-section"><label for="company-email">Email *</label><input type="email" id="company-email" required></div>
                <div class="add-form-section"><label for="company-phone">Téléphone *</label><input type="tel" id="company-phone" required></div>
            </div>
            <div class="add-form-section"><label for="company-tasks">Tâches (une par ligne)</label><textarea id="company-tasks"></textarea></div>
            <div class="add-form-section"><label for="company-requirements">Prérequis (une par ligne)</label><textarea id="company-requirements"></textarea></div>
            <button type="submit" class="btn-submit-company">Ajouter l'organisation</button>
        </form>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function handleAddCompany(event) {
    event.preventDefault();
    const newCompany = {
        id: Math.max(...companies.map(c => c.id), 0) + 1,
        name: document.getElementById('company-name').value,
        sector: document.getElementById('company-sector').value,
        metro: document.getElementById('company-metro').value,
        address: document.getElementById('company-address').value,
        description: document.getElementById('company-description').value,
        duration: document.getElementById('company-duration').value,
        email: document.getElementById('company-email').value,
        phone: document.getElementById('company-phone').value,
        schedule: document.getElementById('company-schedule').value,
        tasks: document.getElementById('company-tasks').value.split('\n').filter(Boolean),
        requirements: document.getElementById('company-requirements').value.split('\n').filter(Boolean),
        isFeatured: false
    };

    if (!metroOptions.includes(newCompany.metro)) metroOptions.push(newCompany.metro);
    if (!sectorOptions.includes(newCompany.sector)) sectorOptions.push(newCompany.sector);

    companies.push(newCompany);
    filteredCompanies = [...companies];
    populateSelectOptions();
    displayCompanies(filteredCompanies);
    renderAdminDashboard();

    document.getElementById('success-container').innerHTML = '<div class="success-message">✅ Организация добавлена.</div>';
    document.getElementById('add-company-form').reset();
}

function closeModal() {
    document.getElementById('company-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getSectorBreakdown() {
    return companies.reduce((acc, company) => {
        acc[company.sector] = (acc[company.sector] || 0) + 1;
        return acc;
    }, {});
}

function renderAdminDashboard() {
    const kpiContainer = document.getElementById('admin-kpi-grid');
    const sectorContainer = document.getElementById('admin-sector-bars');
    const listContainer = document.getElementById('admin-company-list');

    const uniqueMetros = new Set(companies.map(company => company.metro)).size;
    const featured = companies.filter(company => company.isFeatured).length;
    const averageTasks = (companies.reduce((sum, company) => sum + company.tasks.length, 0) / companies.length).toFixed(1);

    kpiContainer.innerHTML = `
        <div class="admin-kpi"><div class="admin-kpi-label">Организаций</div><div class="admin-kpi-value">${companies.length}</div></div>
        <div class="admin-kpi"><div class="admin-kpi-label">Станций</div><div class="admin-kpi-value">${uniqueMetros}</div></div>
        <div class="admin-kpi"><div class="admin-kpi-label">Premium</div><div class="admin-kpi-value">${featured}</div></div>
        <div class="admin-kpi"><div class="admin-kpi-label">Задач/стажировка</div><div class="admin-kpi-value">${averageTasks}</div></div>
    `;

    const sectorBreakdown = getSectorBreakdown();
    const max = Math.max(...Object.values(sectorBreakdown));
    sectorContainer.innerHTML = '<h3 style="margin-bottom: 0.75rem;">По секторам</h3>' + Object.entries(sectorBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([sector, count]) => `<div class="sector-row"><span>${sector}</span><div class="sector-track"><div class="sector-fill" style="width:${(count / max) * 100}%"></div></div><strong>${count}</strong></div>`)
        .join('');

    listContainer.innerHTML = '<button class="admin-action add" onclick="openAddCompanyModal()">+ Добавить организацию</button>' + companies.map(company => `
        <div class="admin-item">
            <div class="admin-item-head">
                <div class="admin-item-name">${company.isFeatured ? '⭐ ' : ''}${company.name}</div>
                <div class="admin-actions">
                    <button class="admin-action feature" onclick="toggleFeatured(${company.id})">${company.isFeatured ? 'Убрать' : 'Premium'}</button>
                    <button class="admin-action delete" onclick="deleteCompany(${company.id})">Удалить</button>
                </div>
            </div>
            <div class="admin-note">${company.sector} • ${company.metro}</div>
        </div>
    `).join('');
}

function toggleAdminPanel(forceState) {
    const panel = document.getElementById('admin-panel');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !panel.classList.contains('active');
    panel.classList.toggle('active', shouldOpen);
    if (shouldOpen) renderAdminDashboard();
}

function toggleFeatured(companyId) {
    const company = companies.find(item => item.id === companyId);
    if (!company) return;
    company.isFeatured = !company.isFeatured;
    displayCompanies(filteredCompanies);
    renderAdminDashboard();
}

function deleteCompany(companyId) {
    const index = companies.findIndex(item => item.id === companyId);
    if (index === -1) return;
    companies.splice(index, 1);
    filteredCompanies = filteredCompanies.filter(item => item.id !== companyId);
    displayCompanies(filteredCompanies);
    renderAdminDashboard();
}

function toggleNightMode() {
    document.body.classList.toggle('night-mode');
}

function initHiddenAdminShortcuts() {
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeModal();
            toggleAdminPanel(false);
            return;
        }

        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
            toggleAdminPanel(true);
            return;
        }

        if (event.key.length === 1) {
            adminKeyBuffer = (adminKeyBuffer + event.key.toLowerCase()).slice(-5);
            if (adminKeyBuffer === 'admin') {
                toggleAdminPanel(true);
                adminKeyBuffer = '';
            }
        }
    });
}

document.getElementById('company-modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

document.getElementById('search-input').addEventListener('input', filterCompanies);
document.getElementById('metro-filter').addEventListener('change', filterCompanies);
document.getElementById('sector-filter').addEventListener('change', filterCompanies);

displayCompanies(filteredCompanies);
populateSelectOptions();
initHiddenAdminShortcuts();
