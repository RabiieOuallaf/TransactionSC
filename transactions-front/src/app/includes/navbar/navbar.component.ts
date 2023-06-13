import { Component } from '@angular/core';

@Component({
    selector : 'app-navbar',
    templateUrl : './navbar.component.html',
    styleUrls : ['./navbar.component.css'],
    

})


export class NavbarComponent {

    navigationOptions = [
        { label: 'Transactions', icon: '../../../assets/icons/card-payment.png' },
        { label: 'Users', icon: '../../../assets/icons/team.png' },
    ];
    
}