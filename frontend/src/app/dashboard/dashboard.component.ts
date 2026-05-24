import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CapitalizeWordsPipe } from '../shared/pipes/capitalize-words.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [CapitalizeWordsPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  protected readonly user = this.authService.user;
}
