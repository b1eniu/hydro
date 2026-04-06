// js/main.js
import { STATION_DB, RIVERS_LIST } from './config.js';
import { fetchHydroData, fetchWeatherData } from './api.js';
import { renderHydroChart } from './chart.js';

// Stan aplikacji (zmienne pomocnicze)
let activeRiver = localStorage.getItem('lastRiver') || "Wisła";
let activeStation = localStorage.getItem('lastStation') || "";
let hydroData = [];
let isDescending = false;
let currentScale = 48;

/**
 * GŁÓWNA FUNKCJA STARTOWA
 */
async function init() {
    setupEventListeners();
    renderRiverGrid();
    await refreshAllData();
}

/**
 * Pobieranie i wyświetlanie wszystkich danych
 */
async function refreshAllData() {
    // 1. Pobierz dane hydro
    const allData = await fetchHydroData();
    hydroData = allData.filter(s => s.rzeka.toLowerCase() === activeRiver.toLowerCase());
    
    // Sortowanie
    hydroData.sort((a, b) => parseInt(a.id_stacji) - parseInt(b.id_stacji));
    if (isDescending) hydroData.reverse();

    // Jeśli nie mamy wybranej stacji, weź pierwszą z brzegu
    if (!activeStation && hydroData.length > 0) activeStation = hydroData[0].stacja;

    // 2. Pobierz pogodę
    const weather = await fetchWeatherData();
    if (weather) updateWeatherUI(weather.current);

    // 3. Odśwież interfejs
    updateUI();
    document.getElementById('last-update').innerText = `LIVE: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

/**
 * Aktualizacja wyglądu listy i wykresu
 */
function updateUI() {
    const container = document.getElementById('list-container');
    container.innerHTML = '';
    
    document.getElementById('river-display').innerText = activeRiver;
    document.getElementById('station-display').innerText = activeStation;

    localStorage.setItem('lastRiver', activeRiver);
    localStorage.setItem('lastStation', activeStation);

    // Znajdź sąsiednie stacje dla kontekstu
    const idx = hydroData.findIndex(s => s.stacja === activeStation);
    const slice = idx === -1 ? hydroData.slice(0, 7) : hydroData.slice(Math.max(0, idx - 3), idx + 4);

    slice.forEach(s => {
        const isSel = s.stacja === activeStation;
        const curr = parseFloat(s.stan_wody) || 0;
        
        // DOPASOWANIE PO NAZWIE (Naprawa błędów z 1.0.1)
        const dbEntry = STATION_DB[s.stacja.toUpperCase()];
        const ostrz = dbEntry ? dbEntry.ostrz : '---';
        const alarm = dbEntry ? dbEntry.alarm : '---';

        let colorClass = "text-blue-600";
        if (alarm !== '---' && curr >= alarm) colorClass = "status-alarm";
        else if (ostrz !== '---' && curr >= ostrz) colorClass = "status-warning";

        const row = document.createElement('div');
        row.className = `station-row px-6 py-5 flex justify-between items-center cursor-pointer ${isSel ? 'selected-station' : ''}`;
        row.onclick = () => { 
            activeStation = s.stacja; 
            updateUI(); 
            window.scrollTo({top: 0, behavior: 'smooth'}); 
        };
        
        row.innerHTML = `
            <div>
                <p class="font-bold text-gray-800">${s.stacja}</p>
                <div class="flex gap-3 text-[9px] font-black uppercase italic mt-1">
                    <span class="text-orange-400">Ostrz: ${ostrz}</span>
                    <span class="text-red-500">Alarm: ${alarm}</span>
                </div>
            </div>
            <div class="text-right">
                <span class="text-xl font-black font-mono ${colorClass}">${s.stan_wody || '--'}</span>
                <span class="text-[9px] text-gray-300 font-bold ml-1">CM</span>
            </div>
        `;
        container.appendChild(row);

        if (isSel) {
            const ctx = document.getElementById('hydroChart');
            // Generujemy dane do wykresu (na razie symulacja na bazie aktualnej wartości)
            const mockValues = Array.from({length: currentScale + 1}, () => curr + (Math.random() * 4 - 2));
            renderHydroChart(ctx, mockValues, currentScale);
        }
    });
}

function updateWeatherUI(w) {
    document.getElementById('w-temp').innerText = `${Math.round(w.temperature_2m)}°C`;
    document.getElementById('w-rain').innerText = `${w.precipitation.toFixed(1)}mm`;
    document.getElementById('w-wind').innerText = `${w.wind_speed_10m.toFixed(1)}m/s`;
    document.getElementById('w-press').innerText = `${Math.round(w.surface_pressure)}hPa`;
}

function renderRiverGrid() {
    const grid = document.getElementById('river-grid');
    grid.innerHTML = '';
    RIVERS_LIST.sort().forEach(r => {
        const b = document.createElement('button');
        b.className = "p-4 rounded-xl bg-gray-50 text-xs font-bold text-gray-600 text-left border border-gray-100 active:scale-95 transition-all cursor-pointer";
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
    document.getElementById('reverse-btn').onclick = () => {
        isDescending = !isDescending;
        hydroData.reverse();
        updateUI();
        document.getElementById('dir-text').innerText = isDescending ? "Kierunek: Pod prąd" : "Kierunek: Do ujścia";
    };

    [6, 12, 24, 48].forEach(h => {
        document.getElementById(`btn-${h}`).onclick = () => {
            currentScale = h;
            document.querySelectorAll('.time-btn').forEach(b => b.classList.toggle('active', b.id === `btn-${h}`));
            updateUI();
        };
    });
}

// Globalne funkcje dostępne dla HTML (onclick w index.html)
window.toggleScreen = function(id, state) {
    document.getElementById(id).classList.toggle('active', state);
};

// Start aplikacji
init();