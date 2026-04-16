// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract StakingContract {
    IERC20 public stakingToken;
    uint256 public rewardRate = 100; // Rewards per second

    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public rewardDebt;
    mapping(address => uint256) public lastStakeTime;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 reward);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        
        stakedBalances[msg.sender] += amount;
        lastStakeTime[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");
        stakedBalances[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function calculateRewards(address user) public view returns (uint256) {
        uint256 stakingDuration = block.timestamp - lastStakeTime[user];
        return stakedBalances[user] * stakingDuration * rewardRate / 1e18;
    }
}
