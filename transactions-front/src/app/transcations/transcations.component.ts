import { Component } from '@angular/core';

@Component({
  selector: 'app-transcations',
  templateUrl: './transcations.component.html',
  styleUrls: ['./transcations.component.css']
})
export class TranscationsComponent {

  displayAccountList : boolean = false;

   toggleAccountList() {
    this.displayAccountList = !this.displayAccountList;
   }
   

   

}
