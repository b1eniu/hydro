import { STATION_DB, RIVERS_LIST } from './config.js';
import { fetchHydroData, fetchWeatherData, fetchHydroForecast } from './api.js';
import { renderHydroChart } from './chart.js';

let activeRiver = localStorage.getItem('lastRiver') || "Wisła";
let activeStation = localStorage.getItem('lastStation') || "";
let hydroData = [];
let allApiData = [];
let currentScale = 48;

async function init() {
    setupEventListeners();
    renderRiverGrid();
    setupDragToScroll();
    await refreshAllData();
}

function setupDragToScroll() {
    const slider = document.getElementById('list-container');
    let isDown = false; let startY; let scrollTop;
    slider.addEventListener('mousedown', (e) => {
        isDown = true; slider.style.cursor = 'grabbing';
        startY = e.pageY - slider.offsetTop; scrollTop = slider.scrollTop;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - slider.offsetTop;
        const walk = (y - startY) * 1.5;
        slider.scrollTop = scrollTop - walk;
    });
}

async function refreshAllData() {
    allApiData = await fetchHydroData();
    hydroData = allApiData.filter(apiS => {
        const dbEntry = STATION_DB[apiS.stacja.toUpperCase()];
        return (dbEntry?.rzeka || apiS.rzeka).toLowerCase() === activeRiver.toLowerCase();
    });
    if (hydroData.length > 0 && (!activeStation || !hydroData.some(s => s.stacja === activeStation))) {
        activeStation = hydroData[0].stacja;
    }
    updateUI();
    document.getElementById('last-update').innerText = `LIVE: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

async function updateUI() {
    const container = document.getElementById('list-container');
    if (!container) return;
    container.innerHTML = '';
    
    document.getElementById('river-display').innerText = activeRiver;
    document.getElementById('station-display').innerText = activeStation;
    localStorage.setItem('lastRiver', activeRiver);
    localStorage.setItem('lastStation', activeStation);

    for (const s of hydroData) {
        const name = s.stacja.toUpperCase();
        const dbEntry = STATION_DB[name] || {};
        const isSelected = s.stacja === activeStation;
        const currVal = parseFloat(s.stan_wody);

        let badgeBg = "#f0f7ff"; let textColor = "#3b82f6"; 
        if (currVal >= dbEntry.alarm) { badgeBg = "#fff5f5"; textColor = dbEntry.alarmColor || "#f68686"; }
        else if (currVal >= dbEntry.ostrz) { badgeBg = "#fffaf5"; textColor = dbEntry.color || "#fba96c"; }

        const row = document.createElement('div');
        row.className = `station-row px-6 py-5 flex justify-between items-center cursor-pointer ${isSelected ? 'selected-station' : ''}`;
        row.onclick = async () => { 
            activeStation = s.stacja;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (dbEntry.lat) {
                const weather = await fetchWeatherData(dbEntry.lat, dbEntry.lon);
                if (weather) updateWeatherUI(weather.current);
            }
            updateUI(); 
        };
        
        row.innerHTML = `
            <div class="min-w-0">
                <p class="font-bold text-gray-800">${s.stacja}</p>
                <div class="flex gap-2 text-[9px] font-bold uppercase mt-1">
                    <span style="color: ${dbEntry.color || '#94a3b8'}">Ostrz: ${dbEntry.ostrz || '--'}</span>
                    <span style="color: ${dbEntry.alarmColor || '#94a3b8'}">Alarm: ${dbEntry.alarm || '--'}</span>
                </div>
            </div>
            <div class="shrink-0">
                <div style="background-color: ${badgeBg}; padding: 6px 12px; border-radius: 14px; min-width: 70px; text-align: center;">
                    <span class="text-xl font-black font-mono" style="color: ${textColor}">${s.stan_wody || '--'}</span>
                    <span class="text-[9px] font-bold ml-0.5" style="color: ${textColor}">CM</span>
                </div>
            </div>`;
        container.appendChild(row);

        if (isSelected) {
            const ctx = document.getElementById('hydroChart');
            if (ctx) {
                const forecast = await fetchHydroForecast(s.id_stacji);
                const trend = s.tendencja === "0" ? 1 : (s.tendencja === "1" ? -1 : 0);
                const mockHistory = Array.from({length: currentScale}, (_, i) => currVal - (trend * (currentScale - i) * 0.1));
                renderHydroChart(ctx, mockHistory, currentScale, forecast);
            }
        }
    }
}

function updateWeatherUI(w) {
    const el = { 'w-temp': `${Math.round(w.temperature_2m)}°C`, 'w-rain': `${w.precipitation.toFixed(1)}mm`, 'w-wind': `${w.wind_speed_10m.toFixed(1)}m/s`, 'w-press': `${Math.round(w.surface_pressure)}hPa` };
    for (let [id, val] of Object.entries(el)) { if (document.getElementById(id)) document.getElementById(id).innerText = val; }
    if (document.getElementById('wind-direction-container')) document.getElementById('wind-direction-container').style.transform = `rotate(${w.wind_direction_10m}deg)`;
}

function renderRiverGrid() {
    const grid = document.getElementById('river-grid');
    if (!grid) return;
    grid.innerHTML = '';
    RIVERS_LIST.forEach(r => {
        const b = document.createElement('button');
        b.className = "p-4 rounded-xl bg-gray-50 text-[10px] font-black text-gray-400 text-left border border-gray-100 active:scale-95 transition-all";
        b.innerText = r;
        b.onclick = () => { activeRiver = r; activeStation = ""; window.toggleScreen('settings-screen', false); refreshAllData(); };
        grid.appendChild(b);
    });
}

function setupEventListeners() {
    document.getElementById('river-selector-trigger').onclick = () => window.toggleScreen('settings-screen', true);
    document.getElementById('close-settings').onclick = () => window.toggleScreen('settings-screen', false);
    [6, 12, 24, 48].forEach(h => {
        const btn = document.getElementById(`btn-${h}`);
        if (btn) btn.onclick = () => { currentScale = h; document.querySelectorAll('.time-btn').forEach(b => b.classList.toggle('active', b.id === `btn-${h}`)); updateUI(); };
    });
}

window.toggleScreen = (id, state) => { const el = document.getElementById(id); if (el) el.classList.toggle('active', state); };

init();