import { ConsoleLogger, Injectable } from '@nestjs/common';
import { exchange } from './client/client.utils';
import { rebalance } from './rebalance/rebalance';
import * as ccxt from 'ccxt';
import { settings } from './client/client.utils';

@Injectable()
export class AppService implements settings{
  
  pairList = [];
  tokenList = [];
  ratioList = [];

  getHello(): string {
    return 'Hello World!';
  }
  async getTrades() {
    console.log(new ccxt.ftx());
    let orders = await exchange.fetchOrders();
    let wallet = (await exchange.privateGetWalletBalances())['result'];

    let Assets= {};
    let totalAssetVal = 0;
    wallet.forEach(item => {
      totalAssetVal += parseFloat(item.usdValue);
      Assets[item.coin] = parseInt(item.usdValue)
    });
    // const fixedCost = 158;
    // // let trades = await exchange.fetchTrades("SRM/USD");
    // // let positions = await exchange.

    // // let obj = {};
    // // trades.forEach(item => obj[item.id] = item.info);

    // // let json = JSON.stringify(obj);

    return {
      // "totalAssetVal":  totalAssetVal, 
      // "Assets": Assets,
      wallet
    };
  }

  async getRebalance() {

    if ((await exchange.fetchOpenOrders()).length > 0) {
      console.log("has open orders");
      return {"log": "has open orders"};
    }
    //Fix usdValue SOL $1000
    let tempWallet = [{"coin":"USD","total":"2063.9190919","free":"2063.9190919","availableWithoutBorrow":"2063.9190919","usdValue":"2063.9190919045","spotBorrow":"0.0"},
    {"coin":"FTT","total":"25.0","free":"0.0","availableWithoutBorrow":"0.0","usdValue":"1237.25","spotBorrow":"0.0"},
    {"coin":"SRM","total":"1100.0","free":"1100.0","availableWithoutBorrow":"1100.0","usdValue":"3310.363936","spotBorrow":"0.0"},
    {"coin":"SOL","total":"0.0","free":"0.0","availableWithoutBorrow":"0.0","usdValue":"920.0239545","spotBorrow":"0.0"}];
    let wallet = (await exchange.privateGetWalletBalances())['result'];

    let Assets= {};
    let totalAssetVal = 0;
    wallet.forEach(item => {
      totalAssetVal += parseFloat(item.usdValue);
      Assets[item.coin] = parseFloat(item.usdValue);
    });

    let value = parseFloat(Assets['SOL']);
    let fixedValue = 1000.00; //rebalance fixed 
    let difference = Math.abs(+(value - fixedValue).toFixed(5));
    let pctDiff = (difference/fixedValue)*100;

    let ticker = await exchange.fetchTicker("SOL/USD");
    let price = ticker['last'] //price of SOL/USD

    // console.log(ticker.info['minProvideSize']); //minSize

    console.log(Assets['SOL']);
    console.log((await exchange.fetchOrders()));
    // console.log((await exchange.fetchOpenOrders()));
    // console.log((await exchange.fetchOrders()).at(-1)['id']);

    if(pctDiff >= 1) { //change to percent later ***********
      if(value > 1000) {
        let amount = difference/price;
        exchange.createLimitSellOrder("SOL/USD", amount, (price*1.0001));

        console.log("creating order to sell " + amount + " of SOL/USD at $" + price + "($" + (price*1.0001) + ") with value of $" + difference + "($" + (price*1.0001*amount) + ")");
        return {"log": "creating order to sell " + amount + " of SOL/USD at $" + price + "($" + (price*1.0001) + ") with value of $" + difference + "($" + (price*1.0001*amount) + ")"}
      }
      if(value < 1000) {
        let amount = difference/price;
        exchange.createLimitBuyOrder("SOL/USD", amount, (price*0.9999));

        console.log("creating order to buy " + amount + " of SOL/USD at $" + price + "($" + (price*0.9999) + ") with value of $" + difference + "($" + (price*0.9999*amount) + ")");
        return {"log": "creating order to buy " + amount + " of SOL/USD at $" + price + "($" + (price*0.9999) + ") with value of $" + difference + "($" + (price*0.9999*amount) + ")"}
      }
    } else console.log("no rebalance done", value);
    return {"log": "no rebalance done " + value.toString()};
  }


  async checkOpenOrder() { //check if order is still open for 10 seconds after rebalance

    let openOrders = await exchange.fetchOpenOrders();
    // console.log(openOrders.at(-1)['id']);
    if(openOrders.length > 0) {
      exchange.cancelOrder(openOrders.at(-1)['id']);
      return {"log": "order is cancelled please rebalance again"};
    }
    console.log("no open orders")
    return {"log": "no open orders"};
  }
}

