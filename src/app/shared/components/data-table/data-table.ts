import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: T) => string;
  class?: string;
}

export interface DataTableAction<T> {
  label: string;
  icon: string;
  class?: string;
  onClick: (row: T) => void;
  visible?: (row: T) => boolean;
}

export interface DataTableConfig {
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  pageSize?: number;
  showPagination?: boolean;
  showSearch?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTableComponent<T> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() actions: DataTableAction<T>[] = [];
  @Input() loading = false;
  @Input() config: DataTableConfig = {};
  @Input() keyField: keyof T = 'id' as keyof T;
  @Input() showSerialNumber = false;

  @Output() rowClick = new EventEmitter<T>();

  // Expose Math for template
  Math = Math;

  // Internal data signal
  private dataSignal = signal<T[]>([]);

  // Signals for reactive state
  searchQuery = signal('');
  currentPage = signal(1);
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Default config
  defaultConfig: DataTableConfig = {
    searchPlaceholder: 'Search...',
    emptyMessage: 'No data found',
    emptyIcon: 'search',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  mergedConfig!: DataTableConfig;

  constructor(private sanitizer: DomSanitizer) {}

  // Computed values
  filteredData = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const currentData = this.dataSignal();
    if (!query) return currentData;

    return currentData.filter(row =>
      this.columns.some(col => {
        const value = this.getCellValue(row, col);
        return value?.toString().toLowerCase().includes(query);
      })
    );
  });

  sortedData = computed(() => {
    const data = [...this.filteredData()];
    const sortCol = this.sortColumn();
    if (!sortCol) return data;

    return data.sort((a, b) => {
      const aVal = this.getCellValue(a, this.columns.find(c => c.key === sortCol)!);
      const bVal = this.getCellValue(b, this.columns.find(c => c.key === sortCol)!);

      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return this.sortDirection() === 'asc' ? comparison : -comparison;
    });
  });

  paginatedData = computed(() => {
    if (!this.mergedConfig.showPagination) return this.sortedData();

    const pageSize = this.mergedConfig.pageSize || 10;
    const start = (this.currentPage() - 1) * pageSize;
    const end = start + pageSize;
    return this.sortedData().slice(start, end);
  });

  totalPages = computed(() => {
    const pageSize = this.mergedConfig.pageSize || 10;
    return Math.ceil(this.filteredData().length / pageSize);
  });

  ngOnInit() {
    this.mergedConfig = { ...this.defaultConfig, ...this.config };
    this.dataSignal.set(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSignal.set(this.data);
    }
  }

  getCellValue(row: T, column: DataTableColumn<T>): any {
    const value = (row as any)[column.key];
    return column.format ? column.format(value, row) : value;
  }

  onSort(column: DataTableColumn<T>) {
    if (!column.sortable) return;

    if (this.sortColumn() === column.key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column.key);
      this.sortDirection.set('asc');
    }
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }

  executeAction(action: DataTableAction<T>, row: T, event: Event) {
    event.stopPropagation();
    action.onClick(row);
  }

  isActionVisible(action: DataTableAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push(-1, total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  }

  getSanitizedIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  getSerialNumber(index: number): number {
    const pageSize = this.mergedConfig.pageSize || 10;
    const currentPageIndex = this.currentPage() - 1;
    return (currentPageIndex * pageSize) + index + 1;
  }
}
