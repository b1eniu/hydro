// js/api.js

// Twój prywatny Worker na Cloudflare
const MY_PROXY = "https://hydro-proxy.tomaszbieniek86.workers.dev/";

/**
 * Pobiera ogólne dane hydrologiczne (stany bieżące wszystkich stacji)
 * Ten endpoint zazwyczaj działa bez proxy, ale w razie problemów 
 * można go również puścić przez MY_PROXY.
 */
export async function fetchHydroData() {
    try {
        const response = await fetch('https://danepubliczne.imgw.pl/api/data/hydro');
        if (!response.ok) throw new Error('Błąd pobierania danych podstawowych');
        return await response.json();
    } catch (error) {
        console.error("Błąd api.js (hydro):", error);
        return [];
    }
}

/**
 * Pobiera dane pogodowe z Open-Meteo
 */
export async function fetchWeatherData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Błąd pogody');
        return await response.json();
    } catch (error) {
        console.error("Błąd api.js (weather):", error);
        return null;
    }
}

/**
 * Pobiera OFICJALNE PROGNOZY IMGW przez Twój prywatny Worker.
 * Dzięki temu wartości na wykresie będą identyczne z tymi na mapie IMGW.
 */
export async function fetchHydroForecast(stationId) {
    if (!stationId) return null;
    try {
        const target = `https://hydro-back.imgw.pl/station/hydro/status?id=${stationId}`;
        // Dodajemy timestamp, aby uniknąć cache'owania błędów
        const response = await fetch(`${MY_PROXY}?url=${encodeURIComponent(target)}&t=${Date.now()}`);
        
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.forecast && data.forecast.length > 0) {
            console.log(`%c [SUCCESS] Oficjalna prognoza dla ${stationId} `, "color: #00ff00");
            return data.forecast.map(f => f.value);
        }
        return [];
    } catch (e) {
        console.error("Błąd Workera:", e.message);
        return [];
    }
}