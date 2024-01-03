/*
 * @source: https://consensys.github.io/smart-contract-best-practices/recommendations/#avoid-using-txorigin
 * @author: Consensys Diligence  
 * Modified by Gerhard Wagner
 */


//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

contract txOrigin {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function sendTo(address payable receiver, uint amount) public {
        require(tx.origin == owner, "You are not the owner!");
        receiver.transfer(amount);
    }

    receive() external payable {}

    fallback() external payable {}

}