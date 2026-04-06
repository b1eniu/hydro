const MY_PROXY = "https://hydro-proxy.tomaszbieniek86.workers.dev/";

export async function fetchHydroData() {
    try {
        const response = await fetch('https://danepubliczne.imgw.pl/api/data/hydro');
        if (!response.ok) throw new Error('Błąd pobierania danych');
        return await response.json();
    } catch (error) {
        console.error("Błąd api.js (hydro):", error);
        return [];
    }
}

export async function fetchWeatherData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function fetchHydroForecast(stationId) {
    if (!stationId) return [];
    try {
        const target = `https://hydro-back.imgw.pl/station/hydro/status?id=${stationId}`;
        const response = await fetch(`${MY_PROXY}?url=${encodeURIComponent(target)}&t=${Date.now()}`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        if (data.forecast && data.forecast.length > 0) {
            return data.forecast.map(f => f.value);
        }
        return [];
    } catch (e) {
        console.warn("Błąd prognozy IMGW:", e.message);
        return [];
    }
}