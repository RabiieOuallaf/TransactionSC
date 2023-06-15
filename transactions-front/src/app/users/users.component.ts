import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  popupVisible_1 = false;
  popupVisible_2 = false;
  selectedUser = {
    username: '',
    email: ''
  };
  accounts = [];

  openPopup_1() {
    this.popupVisible_1 = true;
  }
  openPopup_2() {
  
    this.popupVisible_2 = true;
  }
  closePopup_1() {
    this.popupVisible_1 = false;
  }
  closePopup_2() {
    this.popupVisible_2 = false;
  }
  // addAccount() {
  //   this.accounts.push({ id: this.accounts.length + 1, username: '', email: '' });
  // }
}
