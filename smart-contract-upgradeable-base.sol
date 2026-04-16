// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UpgradeableBase {
    address public implementation;
    address public owner;

    event Upgraded(address indexed newImplementation);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function upgradeTo(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "Invalid address");
        implementation = newImplementation;
        emit Upgraded(newImplementation);
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
