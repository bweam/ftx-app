import { exchange } from "src/client/client.utils"

export function rebalance(): any {
    console.log("hi");
    let trades = exchange.fetchMyTrades()[0];
    console.log(trades);
    return trades;
}