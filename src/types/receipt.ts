
export interface Receipt {
    id: number;
    no: number;
    amount: number;
    payer: string;
    remarks: string;
    issued_at: Date;
}