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
  userTransactions : any[] = [];

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
  operationTitle : string = '';

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
        this.accountsAndTransactions.createTransaction(this.transactedAmount,2,this.operationTitle,this.operationType); 


      } else {
        alert('Something went wrong');
      }
    }

    if (this.operationType == 'in') {
      this.sold = this.sold + this.transactedAmount;
        this.accountsAndTransactions.createTransaction(this.transactedAmount,2,this.operationTitle,this.operationType); 
    }
  }

  // displaying and switching accounts 

  displayUserAccounts() {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.uid;

    this.accountsAndTransactions.getUserAccounts(userId)
      .subscribe(accounts => {
        this.userAccounts = accounts;
      });
  }
  displayUserTransactions() {
    this.accountsAndTransactions.getUserTransactions(12345678)
        .subscribe(transactions => {
          this.userTransactions = transactions;
        })
  }


}
