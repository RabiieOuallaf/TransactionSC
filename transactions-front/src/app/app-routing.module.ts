import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { TranscationsComponent } from './transcations/transcations.component';
import { AuthGuard } from './auth-guard.service';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },


  {
    path: 'users',
    component: UsersComponent,
    data: {
      title: 'Users Page'
    },
    canActivate:[AuthGuard]
  },
  {
    path: 'transactions',
    component: TranscationsComponent,
    data: {
      title: 'Transactions Page'
    },
    canActivate:[AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
