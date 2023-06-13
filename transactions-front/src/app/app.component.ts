import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transactions-front';
  constructor(private router: Router) {}
  shouldShowNavbar() : boolean {
      const currentRoute = this.router.url;
      return currentRoute !== '/login';
  }
}
