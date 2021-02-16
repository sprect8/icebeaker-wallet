const TipEscrow = artifacts.require("TipEscrow");

module.exports = function (deployer) {
  deployer.deploy(TipEscrow);
};
