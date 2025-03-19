import { Shift } from "./shift"

export interface Course{
    id: number,
    name: string,
    type: string,
    price: number,
    is_closed: boolean,
    registered_date: Date,
    total_of_students: number
    shifts: Shift[]
}