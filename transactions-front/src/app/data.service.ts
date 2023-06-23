import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,QueryFn } from '@angular/fire/compat/firestore';
import { user } from './../models/interfaces.type'
import { map,switchMap } from 'rxjs/operators';
import { Observable, of,take } from 'rxjs';



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
  getAllUsersAccounts() {
    return this.fireStore 
            .collectionGroup('accounts')
            .valueChanges()
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

  createSession(accountId : string , date: Date) {
    const sessionData = {
      accountId : accountId,
      date : date,
      state : 0,
    }

    return new Observable<void>((observer) => {
      this.fireStore.collection('sessions').add(sessionData)
        .then(() => {
          console.log('Session created successfully');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error creating session:', error);
          observer.error(error);
        });
    });
  }
  
  createTransaction(amount: number, sequence: number, title: string, type: string, RIB : number) {
    const transactionMaker = localStorage.getItem('currentAccount') || '';
  
    this.getUserSessions(transactionMaker).pipe(
      take(1),
      switchMap((sessions) => {
        if (sessions.length > 0) {
          const sessionId = sessions[0].id;
          const sessionReference = this.fireStore.collection('sessions').doc(sessionId);
          const transactionCollectionReference = sessionReference.collection('transactions');
          const transactionData = {
            amount: amount,
            sequence: sequence,
            title: title,
            type: type,
            Date: new Date(),
            transactionMaker: transactionMaker,
            RIB : RIB
          };
  
          return transactionCollectionReference.add(transactionData);
        } else {
          return this.createSession(transactionMaker, new Date()).pipe(
            switchMap(() => {
              const sessionReference = this.fireStore.collection('sessions').doc('czeG6Qjax7n0jyhTJhH5'); // Update with the actual dynamic session ID
              const transactionCollectionReference = sessionReference.collection('transactions');
              const transactionData = {
                amount: amount,
                sequence: sequence,
                title: title,
                type: type,
                Date: new Date(),
                transactionMaker: transactionMaker,
                RIB : RIB

              };
  
              return transactionCollectionReference.add(transactionData);
            })
      )}
      })
      ).subscribe({
        next: () => {
          console.log('Transaction created successfully');
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
        }
      });
  }
  
    


}
