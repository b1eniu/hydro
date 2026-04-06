import { STATION_DB } from './config.js';

// Funkcja do otwierania/zamykania okien (Info i Ustawienia)
window.toggleScreen = function(id, state) {
    document.getElementById(id).classList.toggle('active', state);
};

console.log("Hydro 1.1: System załadowany. Baza stacji gotowa.");
