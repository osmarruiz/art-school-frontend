import { Course } from "./course";
import { Transaction } from "./transaction";

export interface Enrollment {
    id: number;
    is_paid: boolean;
    is_exonerated: boolean;
    course: Course[];
    transaction: Transaction;
    registered_at: Date;

}