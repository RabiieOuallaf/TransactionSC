import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {user} from './../models/interfaces.type'
import { query, where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  usersRef: AngularFirestoreCollection<user> | undefined;
  constructor(private fireStore: AngularFirestore) {

  }

  getUsers(): AngularFirestoreCollection<user> {
    return this.fireStore.collection('users');
  }

  getUserByEmail(mail: string): AngularFirestoreCollection<user> {
    return this.fireStore.collection('users', user => user.where('email', '==',mail));
  }

}
