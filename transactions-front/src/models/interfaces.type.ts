export interface User {
    active: number;
    admin: number;
    title: string;
    userId: string;
    userName: string;
    accounts: Account[];
  }
  
  export interface AuthUser {
    name: string;
    email: string;
    password: string;
    uid: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    accounts?: Account[];
  }
  
  export interface Account {
    account_number: number;
    title: string;
  }
  
  export interface Session {
    accountId: string;
    date: string;
    state: number;
    transactions: Transaction[];
  }
  
  export interface Transaction {
    amount: number;
    sequence: number;
    title: string;
    type: string;
  }
  