import { Injectable } from '@angular/core';
import { Account, AuthUser, user } from './../models/interfaces.type';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersCollection: AngularFirestoreCollection<AuthUser>;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.usersCollection = this.firestore.collection<AuthUser>('users');
  }

  getAllUsers(): Observable<AuthUser[]> {
    return this.usersCollection.valueChanges();
  }

  createUser(user: AuthUser): Promise<void> {
    const uid = this.firestore.createId();
    const userWithId: AuthUser = { ...user, uid };

    return this.usersCollection.doc(uid).set(userWithId);
  }

  updateUser(user: AuthUser): Promise<void> {
    const { uid, ...userwithoutId } = user
    return this.usersCollection.doc(uid).update(userwithoutId)
  }
  deleteUser(uid: string): Promise<void> {
    return this.usersCollection.doc(uid).delete();

  }

  createAccount(account: Account, userId: string): Promise<boolean> {
    const accountId = this.firestore.createId();
    const accountWithId: Account = { ...account, id: accountId };
  
    const accountsCollectionRef = this.usersCollection
      .doc(userId)
      .collection('accounts');
  
    // Check the current number of documents in the subcollection
    return accountsCollectionRef.ref.get()
      .then((snapshot) => {
        if (snapshot.size >= 5) {
          throw new Error('Maximum number of accounts reached.');
        } else {
          // Create the new account document
          return accountsCollectionRef.doc(accountId).set(accountWithId);
        }
      })
      .then(() => {
        // Account created successfully
        return true; // Return true indicating successful creation
      })
      .catch((error) => {
        // Handle the error
        console.error('Error creating account:', error);
        return false; // Return false indicating failure
      });
  }
  
  
  
  
  
  
  
}
