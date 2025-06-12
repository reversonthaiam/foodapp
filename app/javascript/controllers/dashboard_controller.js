import { Controller } from "@hotwired/stimulus"
import {Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default class extends Controller {
  initialize() {
    const data = [10, 30, 20, 40, 50, 60]
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const ctx = document.getElementById('revenueChart')
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
  }
}
