// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

    uint public amount;

	bool public isApproved;

    mapping (address => mapping(uint => uint)) public paymentsForAddress;
    uint counter = 0;

	event Approved(uint);
	event Deployed(address);

	constructor(address _arbiter, address _beneficiary, uint _amount) payable {
        require(msg.sender != _arbiter, "Cannot be Arbiter");
        require(msg.sender != _beneficiary, "Cannot be Beneficiary");
        depositor = msg.sender;
		arbiter = _arbiter;
		beneficiary = _beneficiary;

        amount = _amount;

		emit Deployed(msg.sender);
	}

	function approve() external {
		require(msg.sender == arbiter);

        paymentsForAddress[depositor][counter] = amount;

        amount = 0;

		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Failed to send Ether");

		emit Approved(balance);
		isApproved = true;
        counter += 1;

	}

	// function balanceOf() view public returns(uint) {
    //     return address(this).balance;
    // }

  function newDepositAmount(uint _amount) payable external {
      require(msg.sender == depositor, "You are not the original depositor");
      require(isApproved, "First approve previous transaction");

      amount = _amount;
      isApproved = false;
  }
}
//Remix
// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
