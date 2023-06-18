import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],


})


export class NavbarComponent {


    constructor(public auth: AuthService) {

    }

    navigationOptions = [
         { label: 'Transactions', icon: '../../../assets/icons/card-payment.png' },
        { label: 'Users', icon: '../../../assets/icons/team.png' },
    ];


    getUserEmail() {
        localStorage.getItem('user')
        const user = JSON.parse(localStorage.getItem('user')!);
        return user.email;

    }

}