const energyConsumptionData = [1500, 1400, 1600, 1800, 2200, 2500, 2700, 2600, 2400, 2000, 1700, 1600];
const waterConsumptionData = [2500, 2600, 2700, 3000, 3200, 3500, 3700, 3600, 3400, 3100, 2800, 2700];
const carbonImpactData = energyConsumptionData.map(kwh => kwh * 0.4); // 0.4 kg CO2 per kWh

let costPerKWh = 0.12;
let costPerUnitWater = 0.004;

const ctx = document.getElementById('chart').getContext('2d');
const carbonCtx = document.getElementById('carbonChart').getContext('2d');
let chart, carbonChart;

function createChart(labels, data, unitLabel, backgroundColor = '#307473', borderColor = '#205052') {
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + ` ${unitLabel}`;
                        }
                    }
                }
            }
        }
    });

    const halfLength = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, halfLength);
    const secondHalf = data.slice(halfLength);

    const avgFirstHalf = firstHalf.reduce((acc, val) => acc + val, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((acc, val) => acc + val, 0) / secondHalf.length;

    const efficiencyMessageElement = document.getElementById('efficiency-message');

    if (avgFirstHalf > avgSecondHalf) {
        efficiencyMessageElement.textContent = "Cost efficiency and energy efficiency have increased!";
        efficiencyMessageElement.style.color = '#28a745';
    } else if (avgFirstHalf < avgSecondHalf) {
        efficiencyMessageElement.textContent = "Cost efficiency and energy efficiency have decreased!";
        efficiencyMessageElement.style.color = '#dc3545';
    } else {
        efficiencyMessageElement.textContent = "Cost and energy efficiency is stable.";
        efficiencyMessageElement.style.color = '#17a2b8';
    }
}

function createCarbonChart(labels, data) {
    if (carbonChart) carbonChart.destroy();
    carbonChart = new Chart(carbonCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: '#3C9D9B',
                borderColor: '#2C6D6B',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + ' kg CO2';
                        }
                    }
                }
            }
        }
    });
}

document.querySelectorAll('.tab-button').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabType = tab.getAttribute('data-tab');
        if (tabType === 'energyConsumption') {
            const energyCosts = energyConsumptionData.map(kwh => kwh * costPerKWh);
            createChart(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], energyCosts, 'USD');
        } else if (tabType === 'waterConsumption') {
            const waterCosts = waterConsumptionData.map(gallons => gallons * costPerUnitWater);
            createChart(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], waterCosts, 'USD');
        }
    });
});

document.getElementById('carbon-footprint-button').addEventListener('click', () => {
    document.getElementById('carbon-footprint-chart').style.display = 'block';
    createCarbonChart(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], carbonImpactData);
});

document.getElementById('applyCosts').addEventListener('click', () => {
    const costPerKWh = parseFloat(document.getElementById('costPerKWh').value);
    const costPerUnitWater = parseFloat(document.getElementById('costPerUnitWater').value);

    const monthlyEnergyConsumption = 1000;
    const monthlyWaterConsumption = 5000;

    const averageEnergyCost = costPerKWh * monthlyEnergyConsumption;
    const averageWaterCost = costPerUnitWater * monthlyWaterConsumption;

    document.getElementById('averageEnergyCost').textContent = `$${averageEnergyCost.toFixed(2)}`;
    document.getElementById('averageWaterCost').textContent = `$${averageWaterCost.toFixed(2)}`;
});

document.querySelector('.tab-button[data-tab="energyConsumption"]').click();
