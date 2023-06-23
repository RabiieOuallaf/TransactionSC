import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { Account, AuthUser } from 'src/models/interfaces.type';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  popupVisible_1 = false;
  popupVisible_2 = false;
  showAddAccountForm: boolean = false;
  isAccountFormVisible: boolean = false;
  isAccountLimitReached = false;
  users: AuthUser[] = [];
  currentPage = 1;
  selectedUser: AuthUser = {
    uid: '',
    name: '',
    email: '',
    password: '',
    displayName: '',
    photoURL: '',
    emailVerified: false,
    isLoggedIn : true,
  };



  accounts: any[] = [];

  constructor(public auth: AuthService, private userService: UsersService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users: AuthUser[]) => {
      this.users = users;
      console.log(users);

      // // Check if the selected user has 5 documents in the account collection
      // const selectedUser = this.users.find(user => user.uid === this.selectedUser.uid);
      // const selectedUserAccountCount = selectedUser?.
      // this.isAccountLimitReached = selectedUserAccountCount >= 5;
      // this.showAddAccountForm = !this.isAccountLimitReached;
    });
  }





  openPopup_1() {
    this.popupVisible_1 = true;
  }

  openPopup_2(user: AuthUser) {
    this.selectedUser = { ...user };
    this.popupVisible_2 = true;
  }

  closePopup_1() {
    this.popupVisible_1 = false;
  }

  closePopup_2() {
    this.popupVisible_2 = false;
  }

  toggleAddAccountForm() {
    this.isAccountFormVisible = !this.isAccountFormVisible;
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
      emailVerified: false, // Add the appropriate value here
      isLoggedIn : true
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

        // Reset the selectedUser object
        this.selectedUser = {
          name: '',
          email: '',
          password: '',
          uid: '',
          displayName: '',
          photoURL: '',
          emailVerified: false,
          isLoggedIn : true
        };
        this.closePopup_1();
      })
      .catch((error) => {
        // Error occurred while creating the user
        console.error('Error creating user:', error);
      });
  }

  updateUser() {
    this.userService.updateUser(this.selectedUser)
      .then(() => {
        // User updated successfully
        this.createAccount();

        this.closePopup_2();
        console.log('User updated successfully');
        // Perform any additional actions or show a success message
      })
      .catch((error) => {
        // Error occurred while updating user
        console.error('Error updating user:', error);
        // Handle the error or show an error message
      });
  }

  deleteUser(user: AuthUser) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.uid)
        .then(() => {

        })
        .catch((error) => {
          console.log('Error deleting user', error);

        })
    }

  }

  newAccount: Account = { account_number: 0, title: '',isLoggedIn : true};
  createAccount() {
    const account: Account = {
      account_number: this.newAccount.account_number,
      title: this.newAccount.title,
      isLoggedIn : true
    };

    const userId = this.selectedUser.uid; // Get the user ID from the selectedUser object

    this.userService.createAccount(account, userId)
      .then(() => {
        // Account created successfully
        console.log('Account created successfully');
        this.closePopup_2();
        alert('account created');

        // Reset the newAccount object
        this.newAccount = {
          account_number: 0,
          title: '',
          isLoggedIn : true

        };
      })
      .catch((error) => {
        // Handle error
        console.error('Error while creating created:', error);
      });
  }
}
