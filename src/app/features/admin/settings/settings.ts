import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewerLayoutComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  settingsCategories = [
    {
      title: 'Organizations',
      description: 'Manage organizations, their types, and contact information',
      icon: 'building',
      route: '/admin/settings/organizations',
      color: 'blue'
    },
    {
      title: 'Regions',
      description: 'Manage regions and their administrative divisions',
      icon: 'map',
      route: '/admin/settings/regions',
      color: 'green'
    },
    {
      title: 'Districts',
      description: 'Manage districts within regions',
      icon: 'marker',
      route: '/admin/settings/districts',
      color: 'purple'
    }
  ];
}
