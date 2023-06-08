interface user {
    active: number;
    admin: number;
    title : string;
    userId: string;
    userName: string;
    accounts: account[];
}

interface account {
    account_number: number;
    title: string;
}

interface session {
    accountId: string
    date: string;
    state : number;
    transactions: transaction[];
}

interface transaction{
    amount: number;
    sequence: number;
    title: string;
    type: string;
}