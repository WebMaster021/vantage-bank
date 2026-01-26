export interface User {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
}

export interface Account {
    id: string;
    accountNumber: string;
    balance: number;
    fullName: string;
    email: string;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
    timestamp: string;
    sourceAccountNumber: string;
    targetAccountInfo: string;
}