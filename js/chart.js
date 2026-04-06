let hydroChart = null;

export function renderHydroChart(ctx, values, hours, forecastValues = []) {
    if (hydroChart) hydroChart.destroy();

    const labels = Array.from({ length: values.length }, (_, i) => `-${values.length - 1 - i}h`);
    
    // Jeśli brak prognozy z API, symulujemy trend
    let displayForecast = [...forecastValues];
    if (displayForecast.length === 0) {
        const last = values[values.length - 1];
        const prev = values[values.length - 2] || last;
        const diff = last - prev;
        displayForecast = Array.from({ length: 5 }, (_, i) => last + (diff * (i + 1)));
    }

    const forecastLabels = displayForecast.map((_, i) => `+${(i + 1) * 3}h`);
    const allLabels = [...labels, ...forecastLabels];

    const mainData = [...values, ...Array(displayForecast.length).fill(null)];
    const forecastData = [
        ...Array(values.length - 1).fill(null), 
        values[values.length - 1], 
        ...displayForecast
    ];

    const allKnown = [...values, ...displayForecast].filter(v => v !== null);
    const minValue = Math.min(...allKnown);
    const maxValue = Math.max(...allKnown);
    const padding = Math.max((maxValue - minValue) * 0.3, 5);

    hydroChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allLabels,
            datasets: [
                {
                    data: mainData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    data: forecastData,
                    borderColor: '#3b82f6',
                    borderDash: [6, 4],
                    borderWidth: 2,
                    pointRadius: (c) => c.dataIndex >= values.length ? 3 : 0,
                    fill: false,
                    tension: 0.4
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
                        maxTicksLimit: 7,
                        callback: function(v, i) { return i === values.length - 1 ? 'TERAZ' : this.getLabelForValue(v); }
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