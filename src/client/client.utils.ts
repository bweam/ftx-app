import * as ccxt from 'ccxt';
import { client0, client2 } from './client.credentials';

export const exchangeId = 'ftx'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
      apiKey: client2.apiKey,
      secret: client2.secret,
      'headers': {
        'FTX-SUBACCOUNT':client2.subAccount
      }
    })

export interface settings {
  tokenList, //list of names of rebalancing token
  pairList, //list of names of rebalancing pair eg. XRP/USD
  ratioList //list of ratios
}