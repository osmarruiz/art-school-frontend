import { Fee } from "./fee";

export interface TransactionsPending {
    status: string;
    balance: number;
    year: number;
    month: number;
    date: number;
    fee: Fee;
}