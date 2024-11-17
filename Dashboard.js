
const energyConsumptionData = [1500, 1400, 1600, 1800, 2200, 2500, 2700, 2600, 2400, 2000, 1700, 1600];
const waterConsumptionData = [2500, 2600, 2700, 3000, 3200, 3500, 3700, 3600, 3400, 3100, 2800, 2700];
const carbonImpactData = energyConsumptionData.map(kwh => kwh * 0.4); // 0.4 kg CO2 per kWh

let costPerKWh = 0.12;
let costPerUnitWater = 0.004;

const ctx = document.getElementById('chart').getContext('2d');
const carbonCtx = document.getElementById('carbonChart').getContext('2d');
let chart, carbonChart;

// Function to create the main chart
// Function to create the main chart and compare average costs
function createChart(labels, data, unitLabel, backgroundColor = '#307473', borderColor = '#205052') {
    if (chart) chart.destroy(); // Destroy the existing chart to avoid duplication
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor, // Use passed background color
                borderColor: borderColor,         // Use passed border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Hide legend
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + ` ${unitLabel}`; // Format tick labels
                        }
                    }
                }
            }
        }
    });

    // Split the data into two halves
    const halfLength = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, halfLength);
    const secondHalf = data.slice(halfLength);

    // Calculate the average costs for each half
    const avgFirstHalf = firstHalf.reduce((acc, val) => acc + val, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((acc, val) => acc + val, 0) / secondHalf.length;

    // Get the efficiency message container element
    const efficiencyMessageElement = document.getElementById('efficiency-message');

    // Compare the averages and display the appropriate message
    if (avgFirstHalf > avgSecondHalf) {
        efficiencyMessageElement.textContent = "Cost and energy efficiency has increased!";
        efficiencyMessageElement.style.color = '#28a745'; // Green color for increase
    } else if (avgFirstHalf < avgSecondHalf) {
        efficiencyMessageElement.textContent = "Cost and energy efficiency has decreased!";
        efficiencyMessageElement.style.color = '#dc3545'; // Red color for decrease
    } else {
        efficiencyMessageElement.textContent = "Cost and energy efficiency is stable.";
        efficiencyMessageElement.style.color = '#17a2b8'; // Blue color for stable
    }
}

// Function to create the Carbon Footprint chart
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

// Tab functionality
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

// Carbon Footprint button functionality
document.getElementById('carbon-footprint-button').addEventListener('click', () => {
    document.getElementById('carbon-footprint-chart').style.display = 'block';
    createCarbonChart(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], carbonImpactData);
});

// Apply costs
document.getElementById('applyCosts').addEventListener('click', () => {
    const costPerKWh = parseFloat(document.getElementById('costPerKWh').value);
    const costPerUnitWater = parseFloat(document.getElementById('costPerUnitWater').value);

    // Example consumption values (replace with actual data)
    const monthlyEnergyConsumption = 1000; // kWh
    const monthlyWaterConsumption = 5000; // units

    // Calculate average costs
    const averageEnergyCost = costPerKWh * monthlyEnergyConsumption;
    const averageWaterCost = costPerUnitWater * monthlyWaterConsumption;

    // Update the DOM
    document.getElementById('averageEnergyCost').textContent = `$${averageEnergyCost.toFixed(2)}`;
    document.getElementById('averageWaterCost').textContent = `$${averageWaterCost.toFixed(2)}`;
});


// Trigger the default tab on page load
document.querySelector('.tab-button[data-tab="energyConsumption"]').click();
