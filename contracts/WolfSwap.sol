// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WolftToken.sol";

contract WolfSwap is Pausable, Ownable {
    WolftToken token;
    uint256 public wolftokenPriceMatic = 10;

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    constructor(address tokenAddr) {
        token = WolftToken(tokenAddr);
    }

    receive() external payable {}

    function WolfTokenBalance() external view returns (uint256) {
        uint256 balanceToken = token.balanceOf(address(this));
        return balanceToken;
    }

    function BuyWolfToken() external payable returns (uint256) {
        require(msg.value > 0, "send MATIC to buy");

        uint256 amountToken = msg.value * wolftokenPriceMatic;
        uint256 balanceToken = token.balanceOf(address(this));
        // check has enough amount of tokens for the transaction
        require(
            balanceToken >= amountToken,
            "not enough tokens in the contract"
        );
        bool sent = token.transfer(msg.sender, amountToken);
        require(sent, "failed to transfer token");

        return amountToken;
    }

    function WithdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "has not balance to withdraw");
        payable(msg.sender).transfer(balance);
    }

    function GetBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}
