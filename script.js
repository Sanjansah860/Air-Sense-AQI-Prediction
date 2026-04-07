/* ============================================================
   AirSense v2.0 – Advanced Air Quality Intelligence Engine
   ============================================================ */

// ── AQI Category Definitions ───────────────────────────────────
const AQI_CATEGORIES = [
    {
        max: 50, label: 'Good', emoji: '🟢',
        color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.10)', borderColor: 'rgba(34, 197, 94, 0.25)',
        healthIcon: '💚',
        message: 'Air quality is satisfactory. Enjoy your outdoor activities with confidence!',
        tips: [
            'Great day for outdoor exercise and activities.',
            'Open windows to let fresh air into your home.',
            'Ideal conditions for children and elderly to enjoy outside time.',
        ],
        dos: ['Go for a jog or cycle outdoors', 'Open windows for fresh ventilation', 'Let kids play outside freely'],
        donts: ['No restrictions — breathe easy!', 'No need for masks or purifiers']
    },
    {
        max: 100, label: 'Moderate', emoji: '🟡',
        color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.10)', borderColor: 'rgba(234, 179, 8, 0.25)',
        healthIcon: '💛',
        message: 'Air quality is acceptable. Unusually sensitive individuals may experience minor symptoms.',
        tips: [
            'People with respiratory conditions should limit prolonged outdoor exertion.',
            'Children with asthma should be monitored closely.',
            'Consider keeping windows partially closed during peak traffic hours.'
        ],
        dos: ['Light outdoor activities are fine', 'Keep indoor air purifiers on low', 'Stay hydrated throughout the day'],
        donts: ['Avoid prolonged heavy exercise outdoors', 'Don\'t let sensitive individuals run/jog outside', 'Avoid peak traffic areas']
    },
    {
        max: 150, label: 'Unhealthy for Sensitive', emoji: '🟠',
        color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.10)', borderColor: 'rgba(249, 115, 22, 0.25)',
        healthIcon: '🧡',
        message: 'Sensitive groups may experience health effects. General public is less likely to be affected.',
        tips: [
            'People with heart/lung disease, elderly, and children should reduce outdoor exertion.',
            'Keep an N95 mask handy if you must go outside for extended periods.',
            'Run air purifiers indoors, especially in bedrooms.',
            'Avoid exercising near high-traffic areas.'
        ],
        dos: ['Keep air purifiers running indoors', 'Wear N95 mask if going outside', 'Monitor symptoms of vulnerable family members'],
        donts: ['Don\'t exercise near traffic or industrial zones', 'Don\'t keep windows open for long', 'Avoid outdoor gatherings for sensitive groups']
    },
    {
        max: 200, label: 'Unhealthy', emoji: '🔴',
        color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.10)', borderColor: 'rgba(239, 68, 68, 0.25)',
        healthIcon: '❤️',
        message: 'Everyone may begin to experience health effects. Sensitive groups may experience more serious symptoms.',
        tips: [
            'Avoid prolonged or heavy outdoor exertion for everyone.',
            'Wear an N95 mask when outdoors.',
            'Keep doors and windows closed. Use an air purifier.',
            'Sensitive groups should remain indoors.',
            'Avoid driving — traffic contributes to pollution.'
        ],
        dos: ['Stay indoors with purifiers on high', 'Use N95 masks when going out', 'Keep all windows and doors shut'],
        donts: ['Don\'t exercise outdoors at all', 'Don\'t let children play outside', 'Don\'t drive during peak hours', 'Never ignore respiratory symptoms']
    },
    {
        max: 300, label: 'Very Unhealthy', emoji: '🟣',
        color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.10)', borderColor: 'rgba(168, 85, 247, 0.25)',
        healthIcon: '💜',
        message: 'Health alert! Everyone may experience serious health effects.',
        tips: [
            'Avoid all outdoor physical activity.',
            'Wear N95 or better mask if you must go outside.',
            'Stay indoors with windows and doors sealed.',
            'Use HEPA air purifier in main living areas.',
            'Seek medical attention if you experience breathing difficulty.'
        ],
        dos: ['Run HEPA purifiers on maximum', 'Seal gaps in windows and doors', 'Keep emergency contacts ready'],
        donts: ['Don\'t go outside unless absolutely necessary', 'Don\'t open any windows', 'Don\'t exercise even indoors without purification', 'Don\'t ignore chest tightness or coughing']
    },
    {
        max: 500, label: 'Hazardous', emoji: '⚫',
        color: '#7c3aed', bgColor: 'rgba(124, 58, 237, 0.10)', borderColor: 'rgba(124, 58, 237, 0.25)',
        healthIcon: '🖤',
        message: 'Emergency! The entire population is likely to be affected.',
        tips: [
            'Remain indoors. Avoid ALL outdoor activity.',
            'Seal gaps with tape to block outdoor air.',
            'Run air purifiers on maximum continuously.',
            'N95 masks only provide partial protection — stay inside.',
            'Contact local health authorities if you need help.'
        ],
        dos: ['Seal all doors, windows, and vents', 'Run every air purifier you have', 'Call health services if you feel unwell'],
        donts: ['Do NOT go outside for any reason', 'Do NOT open windows even briefly', 'Do NOT exercise at all', 'Do NOT rely only on masks — stay indoors']
    }
];

// ── Pollutant Definitions ──────────────────────────────────────
const POLLUTANTS = [
    { key: 'pm25', name: 'PM2.5', unit: 'µg/m³', max: 250, color: '#ef4444', desc: 'Fine Particles' },
    { key: 'pm10', name: 'PM10', unit: 'µg/m³', max: 420, color: '#f97316', desc: 'Coarse Particles' },
    { key: 'o3', name: 'O₃', unit: 'ppb', max: 200, color: '#eab308', desc: 'Ozone' },
    { key: 'no2', name: 'NO₂', unit: 'ppb', max: 360, color: '#a855f7', desc: 'Nitrogen Dioxide' },
    { key: 'so2', name: 'SO₂', unit: 'ppb', max: 185, color: '#3b82f6', desc: 'Sulfur Dioxide' },
    { key: 'co', name: 'CO', unit: 'ppm', max: 50, color: '#22c55e', desc: 'Carbon Monoxide' },
];

// ── State ──────────────────────────────────────────────────────
const MAX_RECENT = 5;
let recentSearches = JSON.parse(localStorage.getItem('airsense_recent') || '[]');

// ── Stable Pseudo-Random Number Generator (Mulberry32) ────────
function seededRandom(seed) {
    return function () {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function generateStableId(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }
    return Math.abs(hash);
}

// ── Generate Realistic AQI + Pollutant + Weather Data ─────────
function generateLocationData(seed) {
    const rand = seededRandom(seed);

    // AQI: weighted distribution
    const raw = rand();
    let aqi;
    if (raw < 0.30) aqi = Math.floor(rand() * 50) + 1;
    else if (raw < 0.55) aqi = Math.floor(rand() * 50) + 51;
    else if (raw < 0.72) aqi = Math.floor(rand() * 50) + 101;
    else if (raw < 0.85) aqi = Math.floor(rand() * 50) + 151;
    else if (raw < 0.94) aqi = Math.floor(rand() * 100) + 201;
    else aqi = Math.floor(rand() * 100) + 301;

    const pollutants = {};
    POLLUTANTS.forEach(p => {
        const ratio = aqi / 500;
        const base = ratio * p.max;
        const variance = (rand() - 0.5) * 0.4 * p.max;
        pollutants[p.key] = Math.max(0, Math.round((base + variance) * 10) / 10);
    });

    // Weather data
    const weather = {
        temp: Math.round((15 + rand() * 25) * 10) / 10,
        humidity: Math.round(30 + rand() * 55),
        wind: Math.round((0.5 + rand() * 8) * 10) / 10,
        visibility: Math.round((2 + rand() * 18) * 10) / 10,
    };

    return { aqi, pollutants, weather };
}

// ── Generate 7-Day Forecast ────────────────────────────────────
function generateForecast(baseAqi, seed) {
    const rand = seededRandom(seed + 9999);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayIndex = date.getDay();

        // AQI drifts from base with increasing randomness
        const drift = (rand() - 0.5) * (30 + i * 12);
        const forecastAqi = Math.max(5, Math.min(500, Math.round(baseAqi + drift)));

        days.push({
            name: i === 0 ? 'Today' : dayNames[dayIndex],
            aqi: forecastAqi,
            category: getCategory(forecastAqi),
            isToday: i === 0
        });
    }
    return days;
}

// ── Get AQI Category ───────────────────────────────────────────
function getCategory(aqi) {
    return AQI_CATEGORIES.find(c => aqi <= c.max) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

// ── Display AQI Result ─────────────────────────────────────────
function displayAQI(locationName, seed) {
    const { aqi, pollutants, weather } = generateLocationData(seed);
    const cat = getCategory(aqi);

    const resultDiv = document.getElementById('result');
    const loadingState = document.getElementById('loadingState');
    const resultContent = document.getElementById('resultContent');

    // Show loading
    resultDiv.classList.remove('hidden');
    loadingState.classList.remove('hidden');
    resultContent.classList.add('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
        loadingState.classList.add('hidden');
        resultContent.classList.remove('hidden');

        // Location & Time
        document.getElementById('displayLocation').textContent = locationName;
        document.getElementById('timestamp').textContent =
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ' • ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

        // AQI Value (animated)
        animateCounter(document.getElementById('aqiValue'), 0, aqi, 800);
        document.getElementById('aqiValue').style.color = cat.color;

        // Update hero breathing ring
        document.querySelector('.ring-aqi').textContent = aqi;
        updateBreathingRing(cat);

        // Gauge
        animateGauge(aqi);

        // Category Badge
        const badge = document.getElementById('categoryBadge');
        badge.style.background = cat.bgColor;
        badge.style.borderColor = cat.borderColor;
        badge.style.color = cat.color;
        document.getElementById('categoryEmoji').textContent = cat.emoji;
        document.getElementById('aqiCategory').textContent = cat.label;

        // Message
        document.getElementById('aqiMessage').textContent = cat.message;

        // Scale Marker
        const pct = Math.min((aqi / 500) * 100, 100);
        document.getElementById('scaleMarker').style.left = pct + '%';
        document.getElementById('scaleMarker').style.borderColor = cat.color;

        // Weather
        document.getElementById('weatherTemp').textContent = weather.temp + '°C';
        document.getElementById('weatherHumidity').textContent = weather.humidity + '%';
        document.getElementById('weatherWind').textContent = weather.wind + ' m/s';
        document.getElementById('weatherVisibility').textContent = weather.visibility + ' km';

        // AQI card accent
        const heroCard = document.getElementById('aqiHeroCard');
        heroCard.style.setProperty('--aqi-color', cat.color);

        // Pollutants
        renderPollutants(pollutants);

        // Forecast
        const forecast = generateForecast(aqi, seed);
        renderForecast(forecast);
        drawForecastChart(forecast);

        // Health
        renderHealthPanel(cat);

    }, 1000);
}

// ── Animate Counter ────────────────────────────────────────────
function animateCounter(el, from, to, duration) {
    const start = performance.now();
    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(from + (to - from) * ease);
        if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// ── Animate SVG Gauge ──────────────────────────────────────────
function animateGauge(aqi) {
    const fill = document.getElementById('gaugeFill');
    const TRACK_LENGTH = 251;
    const targetDash = Math.min((aqi / 500) * TRACK_LENGTH, TRACK_LENGTH);
    const cat = getCategory(aqi);

    const start = performance.now();
    const duration = 1200;

    function frame(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const current = ease * targetDash;
        fill.setAttribute('stroke-dasharray', `${current} ${TRACK_LENGTH}`);
        fill.setAttribute('stroke', cat.color);
        if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// ── Update Breathing Ring ──────────────────────────────────────
function updateBreathingRing(cat) {
    const rings = document.querySelectorAll('.ring');
    rings.forEach((ring, i) => {
        ring.style.borderColor = cat.color + (i === 0 ? '30' : i === 1 ? '20' : '15');
    });
}

// ── Render Pollutant Cards ─────────────────────────────────────
function renderPollutants(pollutants) {
    const grid = document.getElementById('pollutantsGrid');
    grid.innerHTML = '';

    POLLUTANTS.forEach(p => {
        const val = pollutants[p.key];
        const pct = Math.min((val / p.max) * 100, 100).toFixed(1);

        const card = document.createElement('div');
        card.className = 'pollutant-card';
        card.innerHTML = `
            <div class="pollutant-name">${p.name} <span style="opacity:0.5;font-weight:400;text-transform:none;letter-spacing:0">${p.desc}</span></div>
            <div class="pollutant-value" style="color: ${p.color}">${val}</div>
            <div class="pollutant-unit">${p.unit}</div>
            <div class="pollutant-bar">
                <div class="pollutant-bar-fill" style="width: 0%; background: ${p.color}" data-target="${pct}"></div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Animate bars
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            grid.querySelectorAll('.pollutant-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.target + '%';
            });
        });
    });
}

// ── Render 7-Day Forecast ──────────────────────────────────────
function renderForecast(forecast) {
    const container = document.getElementById('forecastDays');
    container.innerHTML = '';

    forecast.forEach(day => {
        const el = document.createElement('div');
        el.className = 'forecast-day' + (day.isToday ? ' today' : '');
        el.innerHTML = `
            <span class="forecast-day-name">${day.name}</span>
            <span class="forecast-aqi-value" style="color:${day.category.color}">${day.aqi}</span>
            <div class="forecast-category-dot" style="background:${day.category.color}"></div>
            <span class="forecast-category-label">${day.category.label.split(' ')[0]}</span>
        `;
        container.appendChild(el);
    });
}

// ── Draw Forecast Chart (Canvas) ───────────────────────────────
function drawForecastChart(forecast) {
    const canvas = document.getElementById('forecastCanvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const padding = { top: 20, right: 20, bottom: 20, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxAqi = Math.max(...forecast.map(d => d.aqi), 100);
    const minAqi = Math.min(...forecast.map(d => d.aqi), 0);
    const range = maxAqi - minAqi || 1;

    const points = forecast.map((d, i) => ({
        x: padding.left + (i / (forecast.length - 1)) * chartW,
        y: padding.top + chartH - ((d.aqi - minAqi) / range) * chartH * 0.85,
        aqi: d.aqi,
        color: d.category.color
    }));

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartH;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();
    }

    // Gradient fill under curve
    if (points.length > 1) {
        const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
        gradient.addColorStop(0, points[0].color + '30');
        gradient.addColorStop(1, points[0].color + '00');

        ctx.beginPath();
        ctx.moveTo(points[0].x, h - padding.bottom);
        ctx.lineTo(points[0].x, points[0].y);

        // Smooth curve
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2;
            ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
        }

        ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2;
            ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
        }
        ctx.strokeStyle = points[0].color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }

    // Points
    points.forEach(p => {
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '20';
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // White center
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#0a0e1a' : '#ffffff';
        ctx.fill();

        // Label
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
        ctx.font = '600 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.aqi, p.x, p.y - 14);
    });

    // Y-axis labels
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    ctx.font = '500 9px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartH;
        const val = Math.round(maxAqi - (i / 4) * range);
        ctx.fillText(val, padding.left - 8, y + 3);
    }
}

// ── Render Health Panel ────────────────────────────────────────
function renderHealthPanel(cat) {
    document.getElementById('healthIcon').textContent = cat.healthIcon;
    const ul = document.getElementById('healthTips');
    ul.innerHTML = cat.tips.map(t => `<li>${t}</li>`).join('');

    // Do's & Don'ts
    const grid = document.getElementById('doDontGrid');
    grid.innerHTML = `
        <div class="do-col">
            <div class="do-dont-title">✅ Do's</div>
            <ul class="do-dont-list">
                ${cat.dos.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
        <div class="dont-col">
            <div class="do-dont-title">❌ Don'ts</div>
            <ul class="do-dont-list">
                ${cat.donts.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
    `;
}

// ── City Comparison ────────────────────────────────────────────
function compareAQI() {
    const city1 = document.getElementById('compareCity1').value.trim();
    const city2 = document.getElementById('compareCity2').value.trim();

    if (!city1 || !city2) {
        showToast('⚠️ Please enter both city names');
        return;
    }

    const seed1 = generateStableId(city1.toLowerCase());
    const seed2 = generateStableId(city2.toLowerCase());
    const data1 = generateLocationData(seed1);
    const data2 = generateLocationData(seed2);
    const cat1 = getCategory(data1.aqi);
    const cat2 = getCategory(data2.aqi);

    const side1 = document.getElementById('compareSide1');
    const side2 = document.getElementById('compareSide2');

    function renderSide(el, city, data, cat, isWinner) {
        el.innerHTML = `
            <div class="compare-city-name">${city}</div>
            <div class="compare-aqi-big" style="color:${cat.color}">${data.aqi}</div>
            <div class="compare-cat-badge" style="background:${cat.bgColor};color:${cat.color};border:1px solid ${cat.borderColor}">
                ${cat.emoji} ${cat.label}
            </div>
            ${isWinner ? '<div class="compare-winner">🏆 Better Air Quality</div>' : ''}
            <div class="compare-pollutant-list">
                ${POLLUTANTS.map(p => `
                    <div class="compare-pollutant-row">
                        <span>${p.name}</span>
                        <span style="color:${p.color}">${data.pollutants[p.key]} ${p.unit}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSide(side1, city1, data1, cat1, data1.aqi <= data2.aqi);
    renderSide(side2, city2, data2, cat2, data2.aqi < data1.aqi);

    document.getElementById('compareResult').classList.remove('hidden');
}

// ── Recent Searches ────────────────────────────────────────────
function addRecentSearch(name) {
    recentSearches = recentSearches.filter(s => s.toLowerCase() !== name.toLowerCase());
    recentSearches.unshift(name);
    if (recentSearches.length > MAX_RECENT) recentSearches = recentSearches.slice(0, MAX_RECENT);
    localStorage.setItem('airsense_recent', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const wrapper = document.getElementById('recentSearches');
    const chips = document.getElementById('recentChips');
    chips.innerHTML = '';

    if (recentSearches.length === 0) {
        wrapper.classList.remove('has-items');
        return;
    }

    wrapper.classList.add('has-items');
    recentSearches.forEach(name => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.textContent = name;
        chip.addEventListener('click', () => {
            document.getElementById('locationInput').value = name;
            triggerSearch(name);
        });
        chips.appendChild(chip);
    });
}

// ── Core Search Trigger ────────────────────────────────────────
function triggerSearch(locationName) {
    const name = locationName.trim();
    if (!name) {
        shakeInput();
        return;
    }
    const seed = generateStableId(name.toLowerCase());
    addRecentSearch(name);
    displayAQI(name, seed);
}

function shakeInput() {
    const input = document.getElementById('locationInput');
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
}

// ── Toast Notification ─────────────────────────────────────────
function showToast(text) {
    const toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = text;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ── Share Functionality ────────────────────────────────────────
function shareResult() {
    const location = document.getElementById('displayLocation').textContent;
    const aqi = document.getElementById('aqiValue').textContent;
    const category = document.getElementById('aqiCategory').textContent;
    const text = `🌍 AirSense Report\n📍 ${location}\n📊 AQI: ${aqi} (${category})\n\nCheck your air quality at AirSense!`;

    if (navigator.share) {
        navigator.share({ title: 'AirSense Report', text }).catch(() => { });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Report copied to clipboard!');
        });
    }
}

// ── Theme Toggle ───────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('airsense_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('airsense_theme', next);

    // Redraw forecast chart if visible
    const canvas = document.getElementById('forecastCanvas');
    if (canvas && canvas.width > 0) {
        // Small delay for theme transition
        setTimeout(() => {
            const forecastDays = document.querySelectorAll('.forecast-day');
            if (forecastDays.length > 0) {
                const forecast = [];
                forecastDays.forEach(el => {
                    const aqiVal = parseInt(el.querySelector('.forecast-aqi-value').textContent);
                    forecast.push({
                        aqi: aqiVal,
                        category: getCategory(aqiVal)
                    });
                });
                drawForecastChart(forecast);
            }
        }, 100);
    }
}

// ── Particle Background ────────────────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.4 + 0.1,
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const baseColor = isDark ? '96, 165, 250' : '59, 130, 246';

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseColor}, ${p.opacity})`;
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });

        // Draw subtle connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${baseColor}, ${0.03 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
}

// ── Navbar Scroll Effect ───────────────────────────────────────
function initNavScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ── Hero Stats Counter Animation ───────────────────────────────
function initHeroCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-value[data-count]');
                counters.forEach(el => {
                    const target = parseInt(el.dataset.count);
                    animateCounter(el, 0, target, 1500);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
}

// ── Scroll Reveal ──────────────────────────────────────────────
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section, .feature-card, .tech-card, .compare-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ── Event Listeners ────────────────────────────────────────────
function initEventListeners() {
    const locationInput = document.getElementById('locationInput');
    const clearBtn = document.getElementById('clearBtn');

    // Clear button
    locationInput.addEventListener('input', () => {
        clearBtn.classList.toggle('visible', locationInput.value.length > 0);
    });

    clearBtn.addEventListener('click', () => {
        locationInput.value = '';
        clearBtn.classList.remove('visible');
        locationInput.focus();
    });

    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        triggerSearch(locationInput.value);
    });

    // Enter key
    locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') triggerSearch(locationInput.value);
    });

    // Geolocation
    document.getElementById('locationBtn').addEventListener('click', () => {
        if (!navigator.geolocation) {
            showToast('⚠️ Geolocation is not supported by your browser');
            return;
        }

        const btnText = document.getElementById('locationBtnText');
        const btn = document.getElementById('locationBtn');
        btn.disabled = true;
        btnText.textContent = 'Detecting location…';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                btn.disabled = false;
                btnText.textContent = 'Use My Current Location';

                const lat = position.coords.latitude.toFixed(3);
                const lon = position.coords.longitude.toFixed(3);
                const locationKey = `geo:${lat},${lon}`;
                const displayName = `📍 ${lat}°N, ${lon}°E`;
                const seed = generateStableId(locationKey);

                addRecentSearch(displayName);
                displayAQI(displayName, seed);
            },
            () => {
                btn.disabled = false;
                btnText.textContent = 'Use My Current Location';
                showToast('⚠️ Unable to retrieve location. Please allow permissions.');
            }
        );
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Share button
    document.getElementById('shareBtn').addEventListener('click', shareResult);

    // Compare button
    document.getElementById('compareBtn').addEventListener('click', compareAQI);

    // Compare enter keys
    document.getElementById('compareCity1').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('compareCity2').focus();
    });
    document.getElementById('compareCity2').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') compareAQI();
    });

    // Resize handler for chart
    window.addEventListener('resize', () => {
        const forecastDays = document.querySelectorAll('.forecast-day');
        if (forecastDays.length > 0) {
            const forecast = [];
            forecastDays.forEach(el => {
                const aqiVal = parseInt(el.querySelector('.forecast-aqi-value').textContent);
                forecast.push({
                    aqi: aqiVal,
                    category: getCategory(aqiVal)
                });
            });
            drawForecastChart(forecast);
        }
    });
}

// ── Initialize Everything ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParticles();
    initNavScroll();
    initHeroCounters();
    initScrollReveal();
    initEventListeners();
    renderRecentSearches();
});