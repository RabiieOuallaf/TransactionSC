import { Injectable } from '@angular/core';
import { AuthUser } from './../models/interfaces.type';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
}
