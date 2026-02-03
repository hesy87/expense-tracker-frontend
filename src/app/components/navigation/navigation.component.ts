import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() currentTab = 'dashboard';
  @Output() tabChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  tabs = [
    { id: 'dashboard', icon: 'home', label: 'Home' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'add', icon: 'add_circle', label: 'Add', special: true },
    { id: 'insights', icon: 'pie_chart', label: 'Insights' },
    { id: 'settings', icon: 'settings', label: 'Settings' }
  ];

  handleTab(tab: any) {
    if (tab.special) {
      this.add.emit();
    } else {
      this.tabChange.emit(tab.id);
    }
  }
}
