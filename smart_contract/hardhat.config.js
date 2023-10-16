// https://eth-sepolia.g.alchemy.com/v2/6bpvoeiUhE64nmYw7fwcJslA4n6OCZgE

require('@nomiclabs/hardhat-waffle')
require("dotenv").config();

module.exports = {
  solidity: '0.8.0',

  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY,]
    }
  }
}