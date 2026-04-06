import { STATION_DB, RIVERS_LIST } from './config.js';
import { fetchHydroData, fetchWeatherData, fetchHydroForecast } from './api.js';
import { renderHydroChart } from './chart.js';

let activeRiver = localStorage.getItem('lastRiver') || "Wisła";
let activeStation = localStorage.getItem('lastStation') || "";
let hydroData = [];
let isDescending = false;
let currentScale = 48;

async function init() {
    setupEventListeners();
    renderRiverGrid();
    await refreshAllData();
}

async function refreshAllData() {
    try {
        const allData = await fetchHydroData();
        hydroData = allData.filter(s => s.rzeka.toLowerCase() === activeRiver.toLowerCase());
        
        hydroData.sort((a, b) => parseInt(a.id_stacji) - parseInt(b.id_stacji));
        if (isDescending) hydroData.reverse();

        if (!activeStation && hydroData.length > 0) activeStation = hydroData[0].stacja;

        const dbEntry = STATION_DB[activeStation.toUpperCase()];
        if (dbEntry) {
            const weather = await fetchWeatherData(dbEntry.lat, dbEntry.lon);
            if (weather && weather.current) updateWeatherUI(weather.current);
        }

        updateUI();
        
        const lastUpdateEl = document.getElementById('last-update');
        if (lastUpdateEl) {
            lastUpdateEl.innerText = `LIVE: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
    } catch (err) {
        console.error("Błąd odświeżania:", err);
    }
}

function updateUI() {
    const container = document.getElementById('list-container');
    if (!container) return;
    container.innerHTML = '';
    
    document.getElementById('river-display').innerText = activeRiver;
    document.getElementById('station-display').innerText = activeStation;

    localStorage.setItem('lastRiver', activeRiver);
    localStorage.setItem('lastStation', activeStation);

    const idx = hydroData.findIndex(s => s.stacja === activeStation);
    const slice = idx === -1 ? hydroData.slice(0, 7) : hydroData.slice(Math.max(0, idx - 3), idx + 4);

    slice.forEach(s => {
        const isSel = s.stacja === activeStation;
        const curr = parseFloat(s.stan_wody) || 0;
        const dbEntry = STATION_DB[s.stacja.toUpperCase()];
        
        const ostrz = dbEntry ? dbEntry.ostrz : '---';
        const alarm = dbEntry ? dbEntry.alarm : '---';

        let colorClass = "text-blue-600";
        if (alarm !== '---' && curr >= alarm) colorClass = "status-alarm"; 
        else if (ostrz !== '---' && curr >= ostrz) colorClass = "status-warning"; 

        const row = document.createElement('div');
        row.className = `station-row px-6 py-5 flex justify-between items-center cursor-pointer ${isSel ? 'selected-station' : ''}`;
        
        row.onclick = async () => { 
            activeStation = s.stacja; 
            updateUI(); 
            // Odświeżamy pogodę dla nowej stacji
            const entry = STATION_DB[activeStation.toUpperCase()];
            if (entry) {
                const weather = await fetchWeatherData(entry.lat, entry.lon);
                if (weather && weather.current) updateWeatherUI(weather.current);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        
        row.innerHTML = `
            <div>
                <p class="font-bold text-gray-800">${s.stacja}</p>
                <div class="flex gap-3 text-[9px] font-bold uppercase italic mt-1">
                    <span style="color: ${dbEntry?.color || '#999'}">Ostrz: ${ostrz}</span>
                    <span style="color: ${dbEntry?.alarmColor || '#999'}">Alarm: ${alarm}</span>
                </div>
            </div>
            <div class="text-right">
                <span class="text-xl font-black font-mono ${colorClass}">${s.stan_wody || '--'}</span>
                <span class="text-[9px] text-gray-300 font-bold ml-1">CM</span>
            </div>
        `;
        container.appendChild(row);

        if (isSel) {
            const canvas = document.getElementById('hydroChart');
            if (canvas) {
                fetchHydroForecast(s.id_stacji).then(forecastData => {
                    const trendDir = s.tendencja === "0" ? 1 : (s.tendencja === "1" ? -1 : 0);
                    const history = Array.from({length: currentScale}, (_, i) => {
                        const timeGap = currentScale - i;
                        return curr - (trendDir * timeGap * 0.15) + (Math.random() * 0.3);
                    });

                    // Jeśli Worker nie zwrócił prognozy, generujemy ją sami
                    const finalForecast = (forecastData && forecastData.length > 0) 
                        ? forecastData 
                        : [curr + (trendDir * 2), curr + (trendDir * 5), curr + (trendDir * 7)];

                    renderHydroChart(canvas, history, currentScale, finalForecast);
                });
            }
        }
    });
}

function updateWeatherUI(w) {
    if (!w) return;
    const ids = { 'w-temp': `${Math.round(w.temperature_2m)}°C`, 'w-rain': `${w.precipitation}mm`, 'w-wind': `${w.wind_speed_10m}m/s`, 'w-press': `${Math.round(w.surface_pressure)}hPa` };
    Object.entries(ids).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });
    const arrow = document.getElementById('wind-direction-container');
    if (arrow) arrow.style.transform = `rotate(${w.wind_direction_10m}deg)`;
}

function renderRiverGrid() {
    const grid = document.getElementById('river-grid');
    if (!grid) return;
    grid.innerHTML = '';
    [...RIVERS_LIST].sort().forEach(r => {
        const b = document.createElement('button');
        b.className = "p-4 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 text-left active:scale-95 transition-all";
        b.innerText = r;
        b.onclick = () => { 
            activeRiver = r; 
            activeStation = ""; 
            window.toggleScreen('settings-screen', false); 
            refreshAllData(); 
        };
        grid.appendChild(b);
    });
}

function setupEventListeners() {
    const trigger = document.getElementById('river-selector-trigger');
    if (trigger) trigger.onclick = () => window.toggleScreen('settings-screen', true);

    [6, 12, 24, 48].forEach(h => {
        const btn = document.getElementById(`btn-${h}`);
        if (btn) {
            btn.onclick = () => {
                currentScale = h;
                document.querySelectorAll('.time-btn').forEach(b => b.classList.toggle('active', b.id === `btn-${h}`));
                updateUI();
            };
        }
    });
}

window.toggleScreen = (id, state) => document.getElementById(id)?.classList.toggle('active', state);

init();