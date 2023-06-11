import { Component } from '@angular/core';

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

  isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '';
  }

  handleLogin(event: Event) {
    event.preventDefault();
    try {
      // Your login logic here using HttpClient or any other Angular HTTP library
      this.email = '';
      this.password = '';
    } catch (error) {
      console.log(error);
    }
  }
}
