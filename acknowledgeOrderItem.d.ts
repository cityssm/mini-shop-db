import type { MiniShopConfig } from "./types.js";
export declare const _acknowledgeOrderItem: (config: MiniShopConfig, orderID: number | string, itemIndex: number | string, acknowledgeValues: {
    acknowledgedUser: string;
    acknowledgedTime?: Date;
}) => Promise<boolean>;
export default _acknowledgeOrderItem;
