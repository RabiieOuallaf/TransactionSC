import { Injectable, NgZone } from '@angular/core';
import { UserCredential } from '@firebase/auth-types';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthUser } from 'src/models/interfaces.type';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: AuthUser = {
    uid: '',
    name: '',
    email: '',
    password: '',
    displayName: '',
    photoURL: '',
    emailVerified: false,

  };
  isLoggedIn: boolean = false;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userData = JSON.parse(localStorage.getItem('user')!);
        this.currentUser = userData ? userData : this.currentUser;
        this.isLoggedIn = true;
      } else {
        this.currentUser = {
          uid: '',
          name: '',
          email: '',
          password: '',
          displayName: '',
          photoURL: '',
          emailVerified: false,
        };
        this.isLoggedIn = false;
      }
    });
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        throw error;
      });
  }


  SignIn(email: string, password: string) {
    if (!this.validateEmail(email)) {
      alert('Invalid email');
      return; // Stop the function execution if email is invalid

    }

    if (!this.validatePassword(password)) {
      alert('Invalid password');
      return; // Stop the function execution if password is invalid
    }

    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result && result.user) {
          this.SetUserData(result.user);
          this.afAuth.authState.subscribe((user) => {

            if (user) {
              this.router.navigate(['transactions']);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        alert('This account is not authorized');
      });
  }

  private validateEmail(email: string): boolean {
    // email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    // password validation logic
    return password.length >= 6;
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<AuthUser> = this.afs.doc<AuthUser>(`users/${user.uid}`);
    const userData: AuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      name: '',
      password: '',

    };

    if (user.displayName) {
      userData.name = user.displayName; // Assign user.displayName to userData.name
    }
    

    this.currentUser = userData;
    userRef.set(userData, {
      merge: true,
    });

    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
  }

  SignOut() {
    
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user'); // Remove the 'user' item from localStorage
      this.router.navigate(['login']); // Navigate to the sign-in page or any other desired page
    });
  }


  getUser() {
    return this.currentUser.email;
  }
}
