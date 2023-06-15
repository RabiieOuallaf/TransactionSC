import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isEmailFocused: boolean = false;
  isPasswordFocused: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(private auth: AuthService, private data: DataService) {

  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }  
  onInputFocus(inputType: string) {
    if (inputType === 'email') {
      this.isEmailFocused = true;
    } else if (inputType === 'password') {
      this.isPasswordFocused = true;
    }
  }

  onInputBlur(inputType: string) {
    if (inputType === 'email') {
      this.isEmailFocused = false;
    } else if (inputType === 'password') {
      this.isPasswordFocused = false;
    }
  }

  // isFormValid(): boolean {
  //   return this.email.trim() !== '' && this.password.trim() !== '';
  // }

  handleLogin(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const signInPromise = this.auth.SignIn(this.email, this.password);
    
    if (signInPromise) {
      signInPromise
        .then(() => {
          // Authentication succeeded, proceed with further actions
        })
        .catch((error) => {
          // Authentication failed, display an alert
          alert('Email or password is not working');
        });
    } else {
      // Handle the case where SignIn method returns undefined
      alert('Sign-in method is not available');
    }
  }
  
  
  


}
    // this.data.getUserByEmail('md.chbani@gmail.com').snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c =>
    //       ({ id: c.payload.doc.id, ...c.payload.doc.data() })
    //     )
    //   )
    // ).subscribe(data => {
    //   console.log(data);
    // });