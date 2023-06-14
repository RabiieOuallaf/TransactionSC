import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-transcations',
  templateUrl: './transcations.component.html',
  styleUrls: ['./transcations.component.css']
})
export class TranscationsComponent {

  displayAccountList : boolean = false;
  displayTransactionMenu : boolean = false;
  showRib : boolean = false;
  sold : number = 0;

  constructor(public auth: AuthService) {

  }

  // ==== Toggle methods ==== //

   toggleAccountList() {
    this.displayAccountList = !this.displayAccountList;
   }
   toggleTransactionMenu() {
    this.displayTransactionMenu = !this.displayTransactionMenu;
   }
   toggleRibVisiblity(selectedValue : string) {
    this.showRib = selectedValue !== 'IN';
    console.log('this.showRib');
   }

   

   // ==== Transaction methods ==== //
   transactedAmount : number = 0;
   operationType : string = 'IN';

   setTransactedAmount(value : number) {
    this.transactedAmount = value;
   }

   setOperationMode(value : string) {
    this.operationType = value;
   }

   makeTransaction() {
     
     if(this.operationType == 'OUT'){
        if(this.transactedAmount <= this.sold){

        this.sold = this.sold - this.transactedAmount;

      }else {
        alert('Something went wrong');
      }
    }

    if(this.operationType == 'IN') {
      this.sold = this.sold + this.transactedAmount;
    }
   }

}
