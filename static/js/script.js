let flowChart, revenueChart;

async function fetchData() {
  const res = await fetch("/data");
  const data = await res.json();

  // Update live occupancy
  const lastOccupied = data.occupied[data.occupied.length - 1] || 0;
  document.getElementById("liveCount").innerText = `${lastOccupied} / ${data.total}`;

  // Performance Insights
  const utilization = (lastOccupied / data.total) * 100;
  document.getElementById("performance").innerText = utilization.toFixed(1) + "% utilized";

  // Update timestamp
  document.getElementById("timestamp").innerText = 
    "Last updated: " + new Date().toLocaleTimeString();

  // Update charts
  updateFlowChart(data.times, data.flow_rate);
  updateRevenueChart(data.days, data.revenue);
}

function updateFlowChart(labels, values) {
  const ctx = document.getElementById("flowChart").getContext("2d");
  if (flowChart) flowChart.destroy();
  flowChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Flow Rate (Hourly)",
        data: values,
        borderColor: "#005b96",
        backgroundColor: "rgba(0, 91, 150, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function updateRevenueChart(labels, values) {
  const ctx = document.getElementById("revenueChart").getContext("2d");
  if (revenueChart) revenueChart.destroy();
  revenueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Revenue per Day ($)",
        data: values,
        backgroundColor: "rgba(0, 91, 150, 0.5)",
        borderColor: "#03396c",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

fetchData();
setInterval(fetchData, 10000);
