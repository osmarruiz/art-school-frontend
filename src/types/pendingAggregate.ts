import { Student } from "./student";

export interface PendingAggregate{
    total_pending: number;
    payload: {
        student: Student;
        total_transactions: number;
        balance_sum: number;
        balance_avg: number;
        min_due_date: string;
        max_due_date: string;}[];
}