import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { TranscationsComponent } from './transcations/transcations.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './includes/navbar/navbar.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    TranscationsComponent,
    NavbarComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
