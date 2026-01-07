import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss'
})
export class LineChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() data!: ChartData;
  @Input() height: string = '300px';
  @Input() title: string = '';
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private viewInitialized = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.viewInitialized && this.data && this.data.labels.length > 0) {
      // Recreate chart when data changes
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.data || this.data.labels.length === 0) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: false,  // Government style: use boxes, not circles
              padding: 12,
              font: {
                size: 11,
                family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                weight: 500
              },
              color: '#475569'      // Government gray
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1E293B',  // Government dark gray
            padding: 10,
            cornerRadius: 4,             // Minimal rounding
            titleFont: {
              size: 12,
              weight: 600
            },
            bodyFont: {
              size: 11
            },
            borderColor: '#CBD5E1',
            borderWidth: 0
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: true,
              color: '#E4E9F0'     // Government border
            },
            grid: {
              color: '#E4E9F0',    // Subtle grid lines
              lineWidth: 1
            },
            ticks: {
              font: {
                size: 11,
                family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              },
              color: '#64748B'     // Government gray text
            }
          },
          x: {
            border: {
              display: true,
              color: '#E4E9F0'
            },
            grid: {
              display: false       // Cleaner look
            },
            ticks: {
              font: {
                size: 11,
                family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              },
              color: '#64748B'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
