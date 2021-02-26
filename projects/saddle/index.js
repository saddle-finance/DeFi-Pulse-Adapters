/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');

/*==================================================
  Addresses
  ==================================================*/

  const tokens = [
    '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa', // TBTC
    '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d', // RENBTC
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
    '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6', // SBTC
  ]

  const btcPoolAddress = "0x4f6A43Ad7cba042606dECaCA730d4CE0A57ac62e"

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    // Vault Asset Balances
    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokens, (token) => {
        return {
          target: token,
          params: btcPoolAddress
        }
      }),
      abi: 'erc20:balanceOf'
    });

    // Compute Balances
    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        let address = balanceOf.input.target
        balances[address] = BigNumber(balances[address] || 0).plus(balanceOf.output).toFixed()
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Saddle-finance',   // project name
    token: null,              // null, or token symbol if project has a custom token
    category: 'dexes',        // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1611057090,        // January 19, 2021 11:51:30 AM
    tvl                       // tvl adapter
  }
