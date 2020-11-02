import type { Order } from "./types";
export declare const getOrder: (orderNumber: string, orderSecret: string, orderIsPaid: boolean) => Promise<false | Order>;
