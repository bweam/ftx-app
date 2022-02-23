import * as ccxt from 'ccxt';
import { client0, client2 } from './client.credentials';

var AWS = require('aws-sdk'),
    region = "ap-southeast-1",
    secretName = "ftx",
    secret,
    decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    
    // Your code goes here. 
});

export const exchangeId = 'ftx'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
      apiKey: client.API_GetSecretValue({"SecretId": "apiKey"}),
      secret: client.API_GetSecretValue({"SecretId": "apiSecret"}),
      'headers': {
        'FTX-SUBACCOUNT':client.API_GetSecretValue({"SecretId": "subAccount"})
      }
    })

export interface settings {
  tokenList, //list of names of rebalancing token
  pairList, //list of names of rebalancing pair eg. XRP/USD
  ratioList //list of ratios
}