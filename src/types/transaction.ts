import { Fee } from "./fee";
import { Receipt } from "./receipt";

export interface Transaction {
    id: number;
    fee: Fee;
    target_date: Date;
    total: number;
    balance: number;
    is_paid: boolean;
    is_finished: boolean;
    is_revoked: boolean;
    started_at: Date;
    finished_at: Date;
    remarks: string;
    receipts: Receipt[];
  }