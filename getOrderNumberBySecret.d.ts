import type { MiniShopConfig } from "./types";
export declare const _getOrderNumberBySecret: (config: MiniShopConfig, orderSecret: string) => Promise<string | false>;
export default _getOrderNumberBySecret;
