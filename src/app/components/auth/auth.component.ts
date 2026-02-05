import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  private authService = inject(AuthService);

  isLogin = true;
  loading = false;

  name = '';
  email = '';
  password = '';

  toggleMode() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) this.name = '';
  }

  async submit() {
    if (!this.email || !this.password || (!this.isLogin && !this.name)) return;
    this.loading = true;
    try {
      if (this.isLogin) {
        await this.authService.signIn(this.email, this.password);
      } else {
        await this.authService.signUp(this.email, this.password, this.name || '');
      }
    } finally {
      this.loading = false;
    }
  }
}
