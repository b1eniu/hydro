// js/config.js

export const RIVERS_LIST = [
    "Wisła", "Odra", "Warta", "Narew", "Bug", "San", "Pilica", "Wieprz", "Radomka", "Dunajec", "Skawa"
];

export const STATION_DB = {
    // --- WISŁA ---
    "KRAKÓW-BIELANY": { rzeka: "Wisła", ostrz: 370, alarm: 520, color: "#fba96c", alarmColor: "#f68686", lat: 50.04, lon: 19.83 },
    "SZCZUCIN": { rzeka: "Wisła", ostrz: 540, alarm: 660, color: "#fba96c", alarmColor: "#f68686", lat: 50.31, lon: 21.07 },
    "SANDOMIERZ": { rzeka: "Wisła", ostrz: 420, alarm: 610, color: "#fba96c", alarmColor: "#f68686", lat: 50.68, lon: 21.75 },
    "ZAWICHOST": { rzeka: "Wisła", ostrz: 480, alarm: 620, color: "#fba96c", alarmColor: "#f68686", lat: 50.80, lon: 21.86 },
    "PUŁAWY": { rzeka: "Wisła", ostrz: 450, alarm: 550, color: "#fba96c", alarmColor: "#f68686", lat: 51.42, lon: 21.95 },
    "DĘBLIN": { rzeka: "Wisła", ostrz: 400, alarm: 500, color: "#fba96c", alarmColor: "#f68686", lat: 51.55, lon: 21.85 },
    "WARSZAWA-BULWARY": { rzeka: "Wisła", ostrz: 600, alarm: 650, color: "#fba96c", alarmColor: "#f68686", lat: 52.24, lon: 21.02 },
    "WYSZKÓW": { rzeka: "Wisła", ostrz: 450, alarm: 550, color: "#fba96c", alarmColor: "#f68686", lat: 52.59, lon: 21.46 },

    // --- RADOMKA ---
    "PRZYTYK": { rzeka: "Radomka", ostrz: 200, alarm: 300, color: "#fba96c", alarmColor: "#f68686", lat: 51.48, lon: 20.91 },
    "MŁODOCIN": { rzeka: "Radomka", ostrz: 70, alarm: 100, color: "#fba96c", alarmColor: "#f68686", lat: 51.34, lon: 21.01 },
    "RYCZYWÓŁ": { rzeka: "Radomka", ostrz: 250, alarm: 350, color: "#fba96c", alarmColor: "#f68686", lat: 51.69, lon: 21.48 },

    // --- ODRA ---
    "RACIBÓRZ-MIEDONIA": { rzeka: "Odra", ostrz: 500, alarm: 650, color: "#fba96c", alarmColor: "#f68686", lat: 50.11, lon: 18.23 },
    "KĘDZIERZYN-KOŹLE": { rzeka: "Odra", ostrz: 450, alarm: 600, color: "#fba96c", alarmColor: "#f68686", lat: 50.34, lon: 18.15 },
    "OPOLE": { rzeka: "Odra", ostrz: 500, alarm: 650, color: "#fba96c", alarmColor: "#f68686", lat: 50.67, lon: 17.92 },
    "BRZEG": { rzeka: "Odra", ostrz: 450, alarm: 530, color: "#fba96c", alarmColor: "#f68686", lat: 50.86, lon: 17.47 },
    "OŁAWA": { rzeka: "Odra", ostrz: 500, alarm: 560, color: "#fba96c", alarmColor: "#f68686", lat: 50.94, lon: 17.30 },
    "WROCŁAW-TRAWOWA": { rzeka: "Odra", ostrz: 400, alarm: 450, color: "#fba96c", alarmColor: "#f68686", lat: 51.10, lon: 17.03 },
    "GŁOGÓW": { rzeka: "Odra", ostrz: 400, alarm: 450, color: "#fba96c", alarmColor: "#f68686", lat: 51.67, lon: 16.09 },

    // --- WARTA ---
    "POZNAŃ-ROCH": { rzeka: "Warta", ostrz: 400, alarm: 500, color: "#fba96c", alarmColor: "#f68686", lat: 52.41, lon: 16.94 },
    "GORZÓW WIELKOPOLSKI": { rzeka: "Warta", ostrz: 380, alarm: 470, color: "#fba96c", alarmColor: "#f68686", lat: 52.73, lon: 15.23 },

    // --- NAREW ---
    "OSTROŁĘKA": { rzeka: "Narew", ostrz: 360, alarm: 380, color: "#fba96c", alarmColor: "#f68686", lat: 53.08, lon: 21.57 },
    "PUŁTUSK": { rzeka: "Narew", ostrz: 400, alarm: 500, color: "#fba96c", alarmColor: "#f68686", lat: 52.70, lon: 21.08 },
    "NOWOGRÓD": { rzeka: "Narew", ostrz: 400, alarm: 500, color: "#fba96c", alarmColor: "#f68686", lat: 53.23, lon: 21.88 },

    // --- BUG ---
    "WŁODAWA": { rzeka: "Bug", ostrz: 300, alarm: 350, color: "#fba96c", alarmColor: "#f68686", lat: 51.54, lon: 23.55 },
    "FRYSZTAK": { rzeka: "Bug", ostrz: 420, alarm: 580, color: "#fba96c", alarmColor: "#f68686", lat: 49.83, lon: 21.61 },

    // --- SAN ---
    "PRZEMYŚL": { rzeka: "San", ostrz: 380, alarm: 550, color: "#fba96c", alarmColor: "#f68686", lat: 49.78, lon: 22.77 },
    "STALOWA WOLA": { rzeka: "San", ostrz: 450, alarm: 500, color: "#fba96c", alarmColor: "#f68686", lat: 50.58, lon: 22.05 },

    // --- PILICA ---
    "SULEJÓW": { rzeka: "Pilica", ostrz: 180, alarm: 230, color: "#fba96c", alarmColor: "#f68686", lat: 51.35, lon: 19.88 },
    "BIAŁOBRZEGI": { rzeka: "Pilica", ostrz: 200, alarm: 260, color: "#fba96c", alarmColor: "#f68686", lat: 51.64, lon: 20.95 },

    // --- WIEPRZ ---
    "LUBARTÓW": { rzeka: "Wieprz", ostrz: 360, alarm: 400, color: "#fba96c", alarmColor: "#f68686", lat: 51.46, lon: 22.61 },
    "KOŚMIN": { rzeka: "Wieprz", ostrz: 300, alarm: 450, color: "#fba96c", alarmColor: "#f68686", lat: 51.58, lon: 21.88 },

    // --- DUNAJEC ---
    "NOWY SĄCZ": { rzeka: "Dunajec", ostrz: 250, alarm: 380, color: "#fba96c", alarmColor: "#f68686", lat: 49.62, lon: 20.69 },

    // --- SKAWA ---
    "ZATOR": { rzeka: "Skawa", ostrz: 250, alarm: 370, color: "#fba96c", alarmColor: "#f68686", lat: 50.00, lon: 19.43 }
};