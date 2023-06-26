import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument,DocumentData,QueryFn } from '@angular/fire/compat/firestore';
import { user } from '../../../models/interfaces.type'
import { map,switchMap } from 'rxjs/operators';
import { Observable, firstValueFrom, of,take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


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
    console.log('userUid', userUid);
    return this.fireStore
      .collection(`users/${userUid}/accounts`)
      .valueChanges();
  }
  getAllUsersAccounts() {
    return this.fireStore 
            .collectionGroup('accounts')
            .valueChanges()
  }
  getAccountByRib(rib: number) {
    return this.fireStore.collectionGroup('accounts', ref => ref.where('account_number', '==', rib));
  }
  getActiveAccounts() {
    return this.fireStore.collectionGroup('accounts', accounts => accounts.where('isLoggedIn', '==', true));
  }
  
  async setSubAccountLoggedIn(accountId: string,userUid : string): Promise<void> {
    const accountRef = this.fireStore.collectionGroup(`accounts`, ref => ref.where('account_number', '==', accountId));
    const querySnapshot = await firstValueFrom(accountRef.get());
  
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update({ isLoggedIn: true });
    } else {
      throw new Error(`Sub-account with accountId ${accountId} not found.`);
    }
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

  getUserTransactionsByOperationType(userId: string, type: string) {
    return this.getUserSessions(userId).pipe(
      switchMap((sessions) => {
        if (sessions.length > 0) {
          const sessionId = sessions[0].id;
          return this.fireStore
          .collection(`sessions/${sessionId}/transactions`, ref => ref.where('type', '==', type).orderBy('Date', 'desc') )
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

    return new Observable<string>((observer) => {
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
  updateTransactionTitle(transactionID: string, newTransactionTitle: string): Promise<void> {
    console.log(transactionID);
    
    const transactionCollectionRef = this.fireStore.collectionGroup('transactions', transaction =>
      transaction.where('transactionID', '==', transactionID)
    );
  
    return transactionCollectionRef.get().toPromise().then(querySnapshot => {
      if (querySnapshot && !querySnapshot.empty) {
        const transactionDocRef = querySnapshot.docs[0].ref;
        return transactionDocRef.update({ title: newTransactionTitle });
      } else {
        throw new Error('Transaction not found');
      }
    });
  }
  createTransaction(amount: number, sequence: number, title: string, type: string, RIB : string) {
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
            RIB : RIB,
            transactionID :uuidv4(),
            source : 2
          };
  
          return transactionCollectionReference.add(transactionData);
        } else {
          return this.createSession(transactionMaker, new Date()).pipe(
            switchMap((sessionId) => {
              const sessionReference = this.fireStore.collection('sessions').doc(sessionId); // Update with the actual dynamic session ID
              const transactionCollectionReference = sessionReference.collection('transactions');
              const transactionData = {
                amount: amount,
                sequence: sequence,
                title: title,
                type: type,
                Date: new Date(),
                transactionMaker: transactionMaker,
                RIB : RIB,
                transactionID :uuidv4(),
                source : 2
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
