import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.scss'
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'chart' | 'text' | 'avatar' | 'table-row' = 'card';
  @Input() count: number = 1;
  @Input() height: string = '100px';
  @Input() width: string = '100%';

  get items(): number[] {
    return Array(this.count).fill(0);
  }

  getBarHeight(index: number): number {
    // Generate consistent heights based on index
    const heights = [80, 60, 95, 70, 85, 65, 90];
    return heights[index % heights.length];
  }
}
