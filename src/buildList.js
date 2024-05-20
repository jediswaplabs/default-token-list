const ciVersion = process.env.VERSION;
const { version } = require("../package.json");
const mainnet = require("./tokens/mainnet.json");
const goerli = require("./tokens/goerli.json");
const sepolia = require("./tokens/sepolia.json");

const { getChecksumAddress } = require("starknet");

module.exports = function buildList() {
  const parsed = ciVersion
    ? ciVersion.match(/(\d+).(\d+).(\d+)/)?.[0]?.split(".")
    : version.split(".");
  return {
    name: "Jediswap Labs List",
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2]
    },
    tags: {},
    logoURI: "ipfs://QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir",
    keywords: ["jediswap", "default"],
    tokens: [...mainnet, ...goerli, ...sepolia]
      // parse address
      .map((token) => ({
        ...token,
        address: getChecksumAddress(token.address)
      }))
      // sort them by symbol for easy readability
      .sort((t1, t2) => {
        if (t1.chainId === t2.chainId) {
          return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
        }
        return t1.chainId < t2.chainId ? -1 : 1;
      })
  };
};
