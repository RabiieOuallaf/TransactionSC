import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-transcations',
  templateUrl: './transcations.component.html',
  styleUrls: ['./transcations.component.css']
})
export class TranscationsComponent {

  displayAccountList: boolean = false;
  displayTransactionMenu: boolean = false;
  sold: number = 0;
  userAccounts: any[] = [];
  userTransactions: any[] = [];

  constructor(public auth: AuthService, public accountsAndTransactions: DataService) {

  }

  ngOnInit(): void {
    this.displayUserAccounts();
    this.displayUserTransactions();

  }

  // ==== Toggle methods ==== //

  toggleAccountList() {
    this.displayAccountList = !this.displayAccountList;
  }
  toggleTransactionMenu() {
    this.displayTransactionMenu = !this.displayTransactionMenu;
  }




  // ==== Transaction methods ==== //
  transactedAmount: number = 0;
  operationType: string = 'in';
  operationTitle: string = '';

  setTransactedAmount(value: number) {
    this.transactedAmount = value;
  }

  setOperationMode(value: string) {
    this.operationType = value;
  }

  setOperationTitle(value: string) {
    this.operationTitle = value;
  }



  makeTransaction() {

    if (this.operationType == 'out') {
      if (this.transactedAmount <= this.sold) {

        this.sold = this.sold - this.transactedAmount;
        this.accountsAndTransactions.createTransaction(this.transactedAmount, 2, this.operationTitle, this.operationType);


      } else {
        alert('Something went wrong');
      }
    }

    if (this.operationType == 'in') {
      this.sold = this.sold + this.transactedAmount;
      this.accountsAndTransactions.createTransaction(this.transactedAmount, 2, this.operationTitle, this.operationType);
    }
  }

  // displaying and switching accounts 
  switchedAccountsHistory: any[] = [];

  currentAccount : string = '';
  currentAccountTransactions : string = '';

  displayUserAccounts() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.uid;
  
    this.accountsAndTransactions.getUserAccounts(userId).subscribe((accounts) => {
      this.userAccounts = accounts;
      localStorage.setItem('currentAccount', this.userAccounts[0].id);
      this.switchedAccountsHistory.push({
        account_id: this.userAccounts[0].id,
        account_username: this.userAccounts[0].title,
        hasChanged: false, // Add a 'hasChanged' property to track changes
      });
      this.currentAccount = this.userAccounts[0].id;
    });
  }
  
  switchUserAccounts(switchedAccountId: string, switchedAccountName: string) {
    this.currentAccountTransactions = localStorage.getItem('currentAccount') || '';
    this.currentAccount = switchedAccountId;
    localStorage.setItem('currentAccount', switchedAccountId);
  
    // Check if the account already exists in the history
    const isDuplicate = this.switchedAccountsHistory.some(
      (account: any) => account.account_id === switchedAccountId
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
        index === self.findIndex((a: any) => a.account_id === account.account_id)
    );
  }

  // display transactions
  displayUserTransactions() {
    const transactionMaker = localStorage.getItem('currentAccount') || '';

    this.accountsAndTransactions.getUserTransactions(transactionMaker)
        .subscribe(transactions => {
          this.userTransactions = transactions;
        })
  }

  isCurrentAccount(accountId: string): boolean {
    return this.currentAccount == accountId;  
  }
  

}
