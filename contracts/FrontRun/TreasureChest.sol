// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/* 
    This contract is going to impersonate a game where a treasure chest has been opened.
    The chest contains some tokens or unit of value.

    As per rules of the game and the logic by which it was created, once a specific timestamp is reached, 
    a function call will be made by the administrators to close the treasure chest. This functionality 
    was added so as to include bonus timed events and so on.

    Assumption is that you as a player are aware that the transaction for closing the treasure chest is coming through
    The goal is to access the treasure chest before the closeChest() transaction goes through and withdraw all its funds

    User will have to connect to Sepolia testnet, gather the blockdata, assign appropriate gas fees and successfully
    withdraw the funds.
*/
contract TreasureChest {
    uint public treasureChest = 500;
    mapping (address => uint) public backpack;
    address creator;

    error ChestAlreadyClosed();

    constructor() {
        creator = msg.sender;
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Only the creators can call this function!");
        _;
    }

    function openTreasure(uint _amount) onlyCreator public {
        treasureChest = _amount;
    } 

    function closeChest() onlyCreator public{
        if(treasureChest == 0)
        {
            revert ChestAlreadyClosed();
        }
        treasureChest = 0;
    }

    function claimTreasure() public {
        require(msg.sender != creator, "It is unfair to let creators take the chest themselves");
        require(treasureChest != 0, "Treasure chest is either claimed or closed!");
        backpack[msg.sender] += treasureChest;
    }

    fallback() external {}
}