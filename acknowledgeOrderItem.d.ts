export declare const acknowledgeOrderItem: (orderID: number | string, itemIndex: number | string, acknowledgeValues: {
    acknowledgedUser: string;
    acknowledgedTime?: Date;
}) => Promise<boolean>;
