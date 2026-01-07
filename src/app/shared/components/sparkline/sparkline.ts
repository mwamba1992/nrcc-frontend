import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sparkline.html',
  styleUrl: './sparkline.scss'
})
export class SparklineComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() width: number = 60;
  @Input() height: number = 24;
  @Input() color: string = '#10B981';
  @Input() fillColor: string = 'rgba(16, 185, 129, 0.1)';

  svgPath: string = '';
  fillPath: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['width'] || changes['height']) {
      this.generatePath();
    }
  }

  private generatePath(): void {
    if (!this.data || this.data.length === 0) {
      this.svgPath = '';
      this.fillPath = '';
      return;
    }

    const max = Math.max(...this.data);
    const min = Math.min(...this.data);
    const range = max - min || 1;

    const stepX = this.width / (this.data.length - 1 || 1);

    // Generate line path
    const points = this.data.map((value, index) => {
      const x = index * stepX;
      const y = this.height - ((value - min) / range) * this.height;
      return `${x},${y}`;
    });

    this.svgPath = `M ${points.join(' L ')}`;

    // Generate fill path (area under the line)
    this.fillPath = `M 0,${this.height} L ${points.join(' L ')} L ${this.width},${this.height} Z`;
  }
}
