import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { AuthUser } from 'src/models/interfaces.type';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  popupVisible_1 = false;
  popupVisible_2 = false;
  users: AuthUser[] = [];
  currentPage = 1;
  selectedUser: AuthUser = {

    uid: '',
    name: '',
    email: '',
    password: '',
    displayName: '',
    photoURL: '',
    emailVerified: false
  };

  accounts: any[] = [];

  constructor(public auth: AuthService, private userService: UsersService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users: AuthUser[]) => {
      this.users = users;
      console.log(users);
    });
  }

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

  createUser() {
    // Store the user data in a separate variable before creating the user
    const newUser: AuthUser = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      password: '', // Add the appropriate value here
      uid: '', // Add the appropriate value here
      displayName: '', // Add the appropriate value here
      photoURL: '', // Add the appropriate value here
      emailVerified: false // Add the appropriate value here
    };

    this.auth.createUserWithEmailAndPassword(this.selectedUser.email, this.selectedUser.password)
      .then((userCredential) => {
        if (userCredential.user) {
          return this.userService.createUser(newUser);
        } else {
          throw new Error('User not found.');
        }
      })
      .then(() => {
        console.log('User created successfully');
        // Optionally, you can refresh the user list by calling getAllUsers() again
        // Reset the selectedUser object
        this.selectedUser = {
          name: '',
          email: '',
          password: '',
          uid: '',
          displayName: '',
          photoURL: '',
          emailVerified: false
        };
      })
      .catch((error) => {
        // Error occurred while creating the user
        console.error('Error creating user:', error);
      });
  }






}
