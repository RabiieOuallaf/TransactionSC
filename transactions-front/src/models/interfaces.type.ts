export interface user {
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
    isLoggedIn: boolean
  }
  
  export interface Account {
    id?: string;
    account_number: number;
    title: string;
    isLoggedIn : boolean
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
  