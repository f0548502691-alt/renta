import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CapitalizeWordsPipe } from './shared/pipes/capitalize-words.pipe';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CapitalizeWordsPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);

  protected readonly appTitle = 'Angular Auth Demo';
  protected readonly currentUser = this.authService.user;
  protected readonly isLoggedIn = this.authService.isLoggedIn;

  protected logout(): void {
    this.authService.logout();
  }
}
