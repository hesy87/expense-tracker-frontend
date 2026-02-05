import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private authService = inject(AuthService);


  async logout() {
    await this.authService.signOut();
    window.location.reload();
  }
}
