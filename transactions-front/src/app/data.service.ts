import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,QueryFn } from '@angular/fire/compat/firestore';
import { user } from './../models/interfaces.type'
import { map,switchMap } from 'rxjs/operators';
import { of } from 'rxjs';



import 'firebase/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  usersRef: AngularFirestoreCollection<user> | undefined;
  constructor(private fireStore: AngularFirestore) { }

  getUsers(): AngularFirestoreCollection<user> {
    return this.fireStore.collection('users');
  }

  getUserByEmail(mail: string): AngularFirestoreCollection<user> {
    return this.fireStore.collection('users', user => user.where('email', '==', mail));
  }

  getUserAccounts(userUid: string) {
    return this.fireStore
      .collection(`users/${userUid}/accounts`)
      .valueChanges();
  }
  getUserSessions(userUid: string) {

    return this.fireStore.collection('sessions', ref =>
      ref.where('accountId', '==', userUid)
    )
    .snapshotChanges()
    .pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id })
          
        )
      )
    );
  }
  getUserTransactions(userId: string) {
    return this.getUserSessions(userId).pipe(
      switchMap((sessions) => {
        if (sessions.length > 0) {
          const sessionId = sessions[0].id;
          return this.fireStore
          .collection(`sessions/${sessionId}/transactions`, ref => ref.orderBy('Date', 'desc'))
          .valueChanges();
        } else {  
          return of([]); // Return an empty array if no session found for the user
        }
      })
    );
  }
  
  createTransaction(amount: number, sequence: number,title : string, type : string) {
    const sessionReference = this.fireStore.collection('sessions').doc('czeG6Qjax7n0jyhTJhH5'); // Get a reference to a new session document with an auto-generated ID
    const transactionCollectionReference = sessionReference.collection('transactions');
    const transactionMaker = localStorage.getItem('currentAccount');
    const transactionData = {
      amount: amount,
      sequence : sequence,
      title: title,
      type : type,
      Date : new Date(),
      transactionMaker : transactionMaker
    }



    transactionCollectionReference.add(transactionData)
      .then(() => {
        console.log('Session created seccussfully !')
        transactionCollectionReference.add(transactionCollectionReference)
      })
      .catch(erorr => {
        console.log(erorr);
      })
  }
    


}
