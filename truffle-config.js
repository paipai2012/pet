const HDWalletProvider = require('@truffle/hdwallet-provider');  //取消注释
const memonic = "verify strong diagram spring chunk vague diesel warrior maid inquiry soon appear";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    ropsten: {
      provider: () => new HDWalletProvider(memonic, "https://ropsten.infura.io/v3/0444ba10bc5e46ca9f97f021239660a6"),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    development: {
      port: 8545
    }
  }
};
