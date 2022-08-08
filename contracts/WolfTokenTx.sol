// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WolftTokenTx is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    using SafeMath for uint256;
    uint256 constant TAX_BURN = 5;

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

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        uint256 burnTax = calcTax(amount);
        _burn(owner, burnTax);
        uint256 amountMinusTax = amount.sub(burnTax);
        _transfer(owner, to, amountMinusTax);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        uint256 burnTax = calcTax(amount);
        _spendAllowance(from, spender, amount);
        _burn(_msgSender(), burnTax);
        uint256 amountMinusTax = amount.sub(burnTax);
        _transfer(from, to, amountMinusTax);
        return true;
    }

    function calcTax(uint256 amount) public pure returns (uint256) {
        uint256 tax = amount.mul(TAX_BURN).div(100);
        return (tax);
    }
}
