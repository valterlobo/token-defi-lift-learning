// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract WolftTokenTx is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    using SafeMath for uint256;

    constructor() ERC20("WolftTokenTx", "WTKX") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals());
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {

       uint256 tax = _calcTax(amount);
       console.log("TAX:");
       console.log(tax);
       _burn(from, tax);
       super._beforeTokenTransfer(from, to, amount);
    }

    function _calcTax(uint256 amount) internal returns (uint256) {
         uint BURN_RATE  = 5 ; 
         console.log(amount);
        uint taxPercent = 5; 
        uint256 precision = 2;
        //uint256 percent = taxPercent.mul(10**precision);
        //uint256 newamount = amount.mul(10**precision);

        //uint256 tax  =  newamount.mul(percent).div(10**precision);
         console.log('-----------------');
        //console.log(tax);
        //console.log(percent);
       
          console.log('------------------');
          console.log(amount.div(20));
          console.log(amount.sub(amount.div(20)));
          uint burnAmount = (amount * BURN_RATE / 100);

          console.log(burnAmount);
         uint256 tax  = amount.div(20);
        //amount.sub()
         
        return (tax);
    }

    function _taxTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal {

         

    }

    function getPercentage(uint256 x) internal view returns (uint256) {
       // uint256 high = 632885842;
        //uint256 low = 316442921;
        uint256 precision = 2;

        //require(x >= low, "Number too low");
        //require(x <= high, "Number too high");

        return x.mul(10**precision);
    }
}
