// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultisigWallet {
    address[] public owners;
    uint256 public requiredConfirmations;

    struct Transaction {
        address to;
        uint256 value;
        bool executed;
        uint256 confirmations;
    }

    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    modifier onlyOwner() {
        bool isOwner = false;
        for (address owner : owners) {
            if (msg.sender == owner) {
                isOwner = true;
                break;
            }
        }
        require(isOwner, "Not owner");
        _;
    }

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "Owners required");
        require(_required > 0 && _required <= _owners.length, "Invalid required");
        owners = _owners;
        requiredConfirmations = _required;
    }

    function submitTransaction(address to, uint256 value) external onlyOwner {
        transactions.push(Transaction({
            to: to,
            value: value,
            executed: false,
            confirmations: 0
        }));
    }

    function confirmTransaction(uint256 txIndex) external onlyOwner {
        require(!isConfirmed[txIndex][msg.sender], "Already confirmed");
        isConfirmed[txIndex][msg.sender] = true;
        transactions[txIndex].confirmations += 1;
    }
}
