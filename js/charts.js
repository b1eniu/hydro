// js/chart.js

let chartObj = null;

/**
 * Inicjalizuje lub aktualizuje wykres hydro
 */
export function renderHydroChart(ctx, dataValues, currentScale = 48) {
    // Jeśli wykres już istnieje, niszczymy go, aby stworzyć nowy (unikamy nakładania się)
    if (chartObj) {
        chartObj.destroy();
    }

    const labels = [];
    const now = new Date();

    // Generujemy etykiety czasu (np. 12:00, 18:00) w zależności od skali
    for (let i = currentScale; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        if (i % (currentScale / 6) === 0) {
            labels.push(d.getHours() + ":00");
        } else {
            labels.push("");
        }
    }

    chartObj = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Poziom wody (cm)',
                data: dataValues,
                borderColor: '#3b82f6',
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 9, weight: 'bold' }, color: '#cbd5e1' }
                },
                y: {
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 10, weight: 'bold' }, color: '#94a3b8' }
                }
            }
        }
    });
}