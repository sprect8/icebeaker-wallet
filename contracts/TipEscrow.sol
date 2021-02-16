// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;

contract TipEscrow {
  address public owner = msg.sender;

  // email hash to amount (bnb) 
  mapping (uint256=>uint256) private emailHashToAmount;
 
  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function hasTips(uint256 _emailHash) public view returns (uint256 result) {
    result = emailHashToAmount[_emailHash];
  }

  function deposit(uint256 _emailHash) public payable {
      emailHashToAmount[_emailHash] += msg.value;
  }

  function claim(address payable _to, uint256 _emailHash) public restricted payable {
    if (emailHashToAmount[_emailHash] < 1) {
        revert("No amount to claim");
    }

    uint256 total = emailHashToAmount[_emailHash];
    emailHashToAmount[_emailHash] = 0;
    _to.transfer(total);
  }
}
