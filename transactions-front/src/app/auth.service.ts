import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthUser } from 'src/models/interfaces.type';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  currentUser: AuthUser = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: false
  };

  constructor(
  public afs: AngularFirestore,
  public afAuth: AngularFireAuth,
  public router: Router,
  public ngZone: NgZone) {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });

  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['transactions']);
          }
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }


  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: AuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    this.currentUser = userData;
    return userRef.set(userData, {
      merge: true,
    });
  }

  getUser() {
    return this.currentUser.email;
  }
  
}
