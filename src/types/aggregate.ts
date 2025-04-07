import { Statistics } from "./statistics";
import { Transaction } from "./transaction";

export interface Aggregate {
    statistics: Statistics;
    payload: Transaction[];
  }