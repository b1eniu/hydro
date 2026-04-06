// js/api.js

/**
 * Pobiera dane hydrologiczne z API IMGW
 */
export async function fetchHydroData() {
    try {
        const response = await fetch('https://danepubliczne.imgw.pl/api/data/hydro/');
        if (!response.ok) throw new Error('Błąd połączenia z API IMGW');
        return await response.json();
    } catch (error) {
        console.error("Błąd podczas pobierania danych hydro:", error);
        return [];
    }
}

/**
 * Pobiera dane pogodowe z Open-Meteo dla Warszawy (jako punktu centralnego)
 * Możemy to później rozbudować o geolokalizację!
 */
export async function fetchWeatherData() {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.2297&longitude=21.0122&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m&wind_speed_unit=ms';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Błąd połączenia z API Pogody');
        return await response.json();
    } catch (error) {
        console.error("Błąd podczas pobierania pogody:", error);
        return null;
    }
}