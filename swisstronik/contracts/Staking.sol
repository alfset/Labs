// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Staking {
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public stakingDurations;
    mapping(address => uint256) public stakingTimestamps;

    uint256 public totalStaked = 0;
    uint256 public totalStakedAmmount;
    address[] public stakers;


    event Staked(address indexed staker, uint256 amount, uint256 duration);
    event Unstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 amount);

    function stake(address ,uint256 amount, uint256 duration) external {
        require(amount > 0, "Amount must be greater than 0");
        if (stakedBalances[msg.sender] == 0) {
            stakers.push(msg.sender); // Add staker to the list if not already staking
        }
        stakedBalances[msg.sender] += amount;
        stakingDurations[msg.sender] = duration;
        stakingTimestamps[msg.sender] = block.timestamp;
        totalStaked += 1;
        totalStakedAmmount += amount; // Update total staked amount
        emit Staked(msg.sender, amount, duration);
    }

    function unstake(address ,uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedBalances[msg.sender] >= amount, "Insufficient staked balance");
        stakedBalances[msg.sender] -= amount;
        if (stakedBalances[msg.sender] == 0) {
            removeStaker(msg.sender); // Remove staker from the list if no more stake
        }
        emit Unstaked(msg.sender, amount);
    }

    function getStakerByIndex(uint256 index) external view returns (address) {
        require(index < stakers.length, "Index out of bounds");
        return stakers[index];
    }

    function stakedBalance(address staker) external view returns (uint256) {
        return stakedBalances[staker];
    }

    function stakingDuration(address staker) external view returns (uint256) {
        return stakingDurations[staker];
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    function getTotalStakedAmmount() external view returns (uint256) {
        return totalStakedAmmount;
    }

    function removeStaker(address staker) internal {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakers[i] == staker) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
                break;
            }
        }
    }

}
