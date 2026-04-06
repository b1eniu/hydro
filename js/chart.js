// js/chart.js
let hydroChart = null;

export function renderHydroChart(ctx, values, hours, forecastValues = []) {
    if (hydroChart) {
        hydroChart.destroy();
    }

    // 1. Przygotowujemy historię (lewa strona)
    const labels = Array.from({ length: values.length }, (_, i) => `-${values.length - 1 - i}h`);
    
    // 2. Przygotowujemy prognozę (prawa strona)
    // Dynamicznie obliczamy ile punktów potrzebujemy, żeby wypełnić prawą połowę
    // Zakładając, że historia ma 'values.length' punktów, prognoza musi mieć tyle samo.
    const step = Math.ceil(hours / values.length) || 1;
    const extendedForecast = [];
    
    for (let i = 0; i < values.length; i++) {
        // Jeśli mamy realne dane z API, używamy ich, 
        // jeśli się skończą - kontynuujemy ostatni trend
        if (i < forecastValues.length) {
            extendedForecast.push(forecastValues[i]);
        } else {
            const lastVal = extendedForecast.length > 0 ? extendedForecast[extendedForecast.length - 1] : values[values.length - 1];
            const prevVal = extendedForecast.length > 1 ? extendedForecast[extendedForecast.length - 2] : values[values.length - 1];
            const trend = lastVal - prevVal;
            extendedForecast.push(lastVal + trend); // Kontynuacja trendu do krawędzi
        }
    }

    const forecastLabels = Array.from({ length: values.length }, (_, i) => `+${(i + 1) * step}h`);
    const allLabels = [...labels, ...forecastLabels];

    // Dane do zestawów
    const mainData = [...values, ...Array(values.length).fill(null)];
    const forecastData = [
        ...Array(values.length - 1).fill(null), 
        values[values.length - 1], 
        ...extendedForecast
    ];

    const minValue = Math.min(...values.filter(v => v !== null), ...forecastValues.filter(v => v !== null));
    const maxValue = Math.max(...values.filter(v => v !== null), ...forecastValues.filter(v => v !== null));
    const padding = Math.max((maxValue - minValue) * 0.4, 5);

    hydroChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allLabels,
            datasets: [
                {
                    label: 'Historia',
                    data: mainData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0
                },
                {
                    label: 'Prognoza',
                    data: forecastData,
                    borderColor: '#3b82f6',
                    borderDash: [6, 4],
                    borderWidth: 2,
                    pointRadius: (index) => index === values.length - 1 ? 0 : 2, // Ukrywamy kropkę na styku
                    pointBackgroundColor: '#fff',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { 
                        maxRotation: 0, 
                        autoSkip: true, 
                        maxTicksLimit: 9,
                        callback: function(val, index) {
                            if (index === values.length - 1) return 'TERAZ';
                            return this.getLabelForValue(val);
                        }
                    }
                },
                y: {
                    suggestedMin: minValue - padding,
                    suggestedMax: maxValue + padding,
                    grid: { color: '#f3f4f6' }
                }
            }
        }
    });
}