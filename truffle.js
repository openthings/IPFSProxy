module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    localhost: {
      host: "localhost",
      port: 8546,
      network_id: "*" // Match any network id
    }
  }
};
