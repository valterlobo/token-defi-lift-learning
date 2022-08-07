// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/TokenTimelock.sol";

contract WolftTokenLock is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public TIME_BLOCK = 1672531201; //Date and time (GMT): Sunday, 1 January 2023 00:00:01
    address public tokenOwner;

    constructor(uint256 timeBlock) ERC20("WolftTokenLock", "WTKL") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 1000000 * 10**decimals());
        _grantRole(MINTER_ROLE, msg.sender);
        TIME_BLOCK = timeBlock;
    }

    modifier checkBlock() {
        string memory msgBlock = string(
            abi.encodePacked("Wait until:", TIME_BLOCK)
        );
        require(
            msg.sender == tokenOwner || block.timestamp > TIME_BLOCK,
            msgBlock
        );
        _;
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
    ) internal override whenNotPaused checkBlock {
        super._beforeTokenTransfer(from, to, amount);
    }
}
