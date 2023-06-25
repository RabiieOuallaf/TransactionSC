import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { DataService } from '../services/transactions/data.service';
import { DatePipe } from '@angular/common';
import { Observable, combineLatest, map, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-transcations',
  templateUrl: './transcations.component.html',
  styleUrls: ['./transcations.component.css'],
  providers: [DatePipe]
})
export class TranscationsComponent {

  displayAccountList: boolean = false;
  displayTransactionMenu: boolean = false;
  displayDepotMenu: boolean = false;
  displayActiveAccountList : boolean = false;

  userAccounts: any[] = [];
  userTransactions: any[] = [];
  userAccountsTransactionsHistory: any[] = [];

  reverseTransactionLabel = 'oldest-newst'


  constructor(
    public auth: AuthService,
    public accountsAndTransactions: DataService,
    private datePipe: DatePipe,
    public afs: AngularFirestore
  ) {

  }

  ngOnInit(): void {
    this.displayUserAccounts();
    this.displayUserTransactions();
    this.setCurrentDate();
  }


  // == current date == //
  currentDate: string = '';
  setCurrentDate() {
    const today = new Date();
    this.currentDate = this.datePipe.transform(today, 'yyyy-MM-dd HH:mm:ss') || '';
  }


  reverseTransactions() {
    this.userTransactions.reverse();
  }
  
  // ==== Toggle methods ==== //
  toggleReverseTransactionsButtonLabel() {
    if (this.reverseTransactionLabel == 'oldest-newst') {
      this.reverseTransactionLabel = 'newst-oldest';
    }else if (this.reverseTransactionLabel == 'newst-oldest'){
      this.reverseTransactionLabel = 'oldest-newst';
    }
  }

  toggleAccountList() {
    this.displayAccountList = !this.displayAccountList;
  }
  toggleActiveAccountList() {
    this.displayActiveAccountList = !this.displayActiveAccountList;
  }
  toggleTransactionMenu() {
    this.displayTransactionMenu = !this.displayTransactionMenu;
  }
  toggleDepotMenu() {
    this.displayDepotMenu = !this.displayTransactionMenu;
  }
  closeDepotMenu() {
    this.displayDepotMenu = false;
   
  }

  /* == Depot methods == */

  removeDepotMenuButton() {
    const depotMenu = document.getElementById('depotMenuButton');
    if (depotMenu) {
      depotMenu.style.display = 'none';
    }
  }
  hasDepotOperation(userTransactions: any[]) {
    const hasDepotOperation = userTransactions.length > 0 ? userTransactions.some(transaction => transaction.type == 'Depot') : false;
    if (hasDepotOperation) {
      const depotMenu = document.getElementById('depotMenuButton');
      if (depotMenu) {
        depotMenu.style.display = 'none';
      }
    } else {
      const depotMenu = document.getElementById('depotMenuButton');
      if (depotMenu) {
        depotMenu.style.display = 'block';
      }
    }
  }




  // ==== setting values of transaction methods ==== //
  transactedAmount: number = 0;
  operationType: string = 'in';
  operationTitle: string = '';
  RIB: number = 0;
  activeAccountNumbers: any[] = [];

  setTransactedAmount(value: number) {
    this.transactedAmount = value;
  }

  setOperationMode(value: string) {
    this.operationType = value;
  }

  setOperationTitle(value: string) {
    this.operationTitle = value;
  }

  setRIB(value: number) {
    this.RIB = value;
  }

  makeTransaction() {
    const isRibExist$ = this.checkRIB(this.RIB);
    const isRibOwnerLoggedIn$ = this.checkRIBOwnerStatus(this.RIB);
  
    combineLatest([isRibExist$, isRibOwnerLoggedIn$]).pipe(take(1)).subscribe(([isRibExist, isRibOwnerLoggedIn]) => {
      if (isRibExist && isRibOwnerLoggedIn) {
        if (this.operationType == 'out') {
          if (this.transactedAmount <= this.totalTransactionAmount) {
            this.totalTransactionAmount -= this.transactedAmount;
            this.accountsAndTransactions.createTransaction(this.transactedAmount, 2, this.operationTitle, this.operationType, this.RIB);
          } else {
            // Insufficient balance
            alert('Insufficient balance. Please check your balance.');
          }
        } else if (this.operationType == 'in') {
          this.totalTransactionAmount += this.transactedAmount;
          this.accountsAndTransactions.createTransaction(this.transactedAmount, 2, this.operationTitle, this.operationType, this.RIB);
        }
      } else {
        if (!isRibExist) {
          // RIB does not exist
          alert('Invalid RIB. Please check the RIB or your balance.');
        } else {
          // RIB owner is not logged in
  
          this.accountsAndTransactions.getActiveAccounts().valueChanges().subscribe((accounts : any[]) => {
            this.activeAccountNumbers = accounts.map(account => account.account_number);
            if(this.activeAccountNumbers.length > 0) {
              this.toggleActiveAccountList();
              this.toggleTransactionMenu();
            }
          });
          alert('RIB owner is not logged in. Please try again later.');
        }
      }
    });
  }
  

  // Getting the total sold of each user 
  calculateTotalTransactionAmount(): number {
    let totalAmount = 0;

    for (const transaction of this.userTransactions) {
      if (transaction.type === 'in' || transaction.type === 'Depot') {
        totalAmount += transaction.amount;
      } else if (transaction.type === 'out') {
        totalAmount -= transaction.amount;
      }
    }

    return totalAmount;
  }


  // separating the logic of transactions to clean up the code 
  postDepot() {
    this.totalTransactionAmount = this.totalTransactionAmount + this.transactedAmount;
    this.accountsAndTransactions.createTransaction(this.transactedAmount, 2, this.operationTitle, 'Depot', 0);
  }

  // RIB validation

  checkRIB(RIB: number) :  Observable<boolean>{
    return this.accountsAndTransactions.getAllUsersAccounts().pipe(
      map((accounts: any[]) => {
        const accountNumbers = accounts.map(account => account.account_number);
        return accountNumbers.includes(RIB);
      })
    ); 
  }
  checkRIBOwnerStatus(RIB: number): Observable<boolean> {
    return this.accountsAndTransactions.getAccountByRib(RIB).valueChanges().pipe(
      map((collection : any[]) => {
        if (collection && collection.length > 0) {
          const account = collection[0];
          return account.isLoggedIn == true;
        }
        return false; // Return false if the collection is empty or undefined
      })
    );
  }
  // displaying and switching accounts 
  switchedAccountsHistory: any[] = [];

  currentAccount: string = '';
  currentAccountTransactions: string = '';

  totalTransactionAmount: number = 0;

  displayUserAccounts() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.uid;

    this.accountsAndTransactions.getUserAccounts(userId).subscribe((accounts) => {
      this.userAccounts = accounts;


    });
  }

  switchUserAccounts(switchedAccountId: string, switchedAccountName: string) {

    this.currentAccountTransactions = localStorage.getItem('currentAccount') || '';
    this.currentAccount = switchedAccountId;
    localStorage.setItem('currentAccount', switchedAccountId);

    this.displayUserTransactions();
    // Check if the account already exists in the history
    const isDuplicate = this.switchedAccountsHistory.some(
      (account: any) => account.account_id == switchedAccountId
    );
    // Add the account to the history only if it's not a duplicate
    if (!isDuplicate) {
      this.switchedAccountsHistory.push({
        'account_id': switchedAccountId,
        'account_username': switchedAccountName
      });
    }

    // Remove duplicates from the history array
    this.switchedAccountsHistory = this.switchedAccountsHistory.filter(
      (account: any, index: number, self: any[]) =>
        index === self.findIndex((a: any) => a.account_id == account.account_id)
    );
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.uid;
    this.accountsAndTransactions.setSubAccountLoggedIn(switchedAccountId,userId);

  }
  // display transactions
  displayUserTransactions() {
    const transactionMaker = localStorage.getItem('currentAccount') || '';

    if (transactionMaker) {
      this.accountsAndTransactions.getUserTransactions(transactionMaker)
        .subscribe(transactions => {
          this.userTransactions = transactions;
          this.hasDepotOperation(transactions);
          this.totalTransactionAmount = this.calculateTotalTransactionAmount();

          // Sort transactions by Date in descending order
          this.userTransactions.sort((a, b) => {
            const dateA = new Date(a.Date);
            const dateB = new Date(b.Date);
            return dateB > dateA ? 1 : -1;
          });

          this.userAccountsTransactionsHistory.push({ transactionMaker: transactionMaker, transactions });
        });
    }
    this.hasDepotOperation(this.userTransactions);

  }
  isCurrentAccount(accountId: string): boolean {
    return this.currentAccount == accountId;
  }


}