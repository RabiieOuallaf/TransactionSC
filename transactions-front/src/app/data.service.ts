import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, } from '@angular/fire/compat/firestore';
import { user } from './../models/interfaces.type'
import { query, where } from '@firebase/firestore';

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
  getUserTransactions(userUid: number) {
    return this.fireStore
      .collection(`sessions/czeG6Qjax7n0jyhTJhH5/transactions`, ref => 
        ref.where('accountId', '==' , userUid)  
      )
      
      .valueChanges();
  }
  createTransaction(amount: number, sequence: number,title : string, type : string) {
    const sessionReference = this.fireStore.collection('sessions').doc('czeG6Qjax7n0jyhTJhH5'); // // Get a reference to a new session document with an auto-generated ID
    const transactionCollectionReference = sessionReference.collection('transactions');
    const userId = localStorage.getItem('transactionMaker');
    const transactionData = {
      amount: amount,
      sequence : sequence,
      title: title,
      type : type,
      transactionMaker : userId
    }



    transactionCollectionReference.add(transactionData)
      .then(() => {
        console.log('Session created seccussfully !')
        transactionCollectionReference.add(transactionCollectionReference)
      })
      .catch(erorr => {
        erorr.log(erorr);
      })
  }


}
