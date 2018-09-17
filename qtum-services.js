const {
  Qtum,
} = require("qtumjs");
const Web3 = require('web3');
const config = require('../contracts/qtum.json');
const contractAbi = config.abi;
const contractAddress = config.address;
const contractOwner = config.owner;

const qtum = new Qtum("http://test:test1234@localhost:13889", {
  contracts: {
    erc721: config
  }
})
const myToken = qtum.contract("erc721")

class QtumService {
  async mint(to) {
    try {
      const tokenId = Math.floor(Math.random() * 10000);
      console.log(`Mint: ${to} - ${tokenId}`)
      const result = await myToken.send("mint", [to, tokenId, to], {
        senderAddress: contractOwner
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
  
  async getLogs(fromBlock, toBlock) {
    const logs = await myToken.logs({
      fromBlock,
      toBlock,
      minconf: 1,
    })
  
    console.log(JSON.stringify(logs, null, 2))
    return logs;
  }
  
  async readInfo(field, params) {
    const result = await myToken.call(field, params)
  
    // supply is a BigNumber instance (see: bn.js)
    const supply = result.outputs[0]
  
    if(Web3.utils.isBN(supply)) {
      return supply.toString();
    } else {
      return supply;
    }
  }
  
  async writeData(field, params) {
    console.log(`Sending ${field} with params ${params}`)
    const result = await myToken.send(field, params, {
      senderAddress: contractOwner
    });
    return result;
  }
}

module.exports = new QtumService();
