module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    development: {
      port: 8545
    }
  }
};
