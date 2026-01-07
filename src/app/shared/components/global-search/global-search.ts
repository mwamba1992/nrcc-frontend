import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-search.html',
  styleUrl: './global-search.scss'
})
export class GlobalSearchComponent {
  @Output() search = new EventEmitter<string>();

  searchQuery: string = '';
  isExpanded: boolean = false;

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Cmd+K or Ctrl+K to focus search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
      searchInput?.focus();
    }

    // Enter to search
    if (event.key === 'Enter') {
      this.onSearch();
    }

    // Escape to blur
    if (event.key === 'Escape') {
      const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
      searchInput?.blur();
      this.isExpanded = false;
    }
  }

  onFocus(): void {
    this.isExpanded = true;
  }

  onBlur(): void {
    if (!this.searchQuery) {
      this.isExpanded = false;
    }
  }
}
