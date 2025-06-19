import { Controller } from "@hotwired/stimulus";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Connects to data-controller="dashboard"
export default class extends Controller {
  static values = { revenue: Array };
  initialize() {
    const data = this.revenueValue.map((item) => item[1]);
    const labels = this.revenueValue.map((item) => item[0]);

    const ctx = document.getElementById("revenueChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue R$',
          data: data,
          borderWidth: 3,
          fill: true
        }]
      },
      options:{
        plugins: {
          legend: {
            display: false
          }
        },
        scales:{
          x: {
            grid: {
              display: false
            }
          },
          y: {
            border: {
              dash: [5, 5]
            },
            grid: {
              color: "#d4f3ef"
            },
            beginAtZero: true
          }
        }
      }
    })

    // new Chart(ctx, {
    //   type: "line",
    //   data: {
    //     labels: Object.keys(data),
    //     datasets: [
    //       {
    //         label: "Revenue by Day",
    //         data: Object.values(data),
    //         backgroundColor: "#DDA15E",
    //         borderColor: "#606C38",
    //         borderWidth: 2,
    //         fill: true,
    //         tension: 0.4,
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: { display: false },
    //     },
    //     scales: {
    //       y: {
    //         ticks: {
    //           color: "#283618",
    //         },
    //       },
    //       x: {
    //         ticks: {
    //           color: "#283618",
    //         },
    //       },
    //     },
    //   },
    // });
  }
}
