// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/math.sol";
import "./Staking.sol";
import "./ipricefeed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract LiquidityToken is ERC20 {
    using SafeERC20 for IERC20;

    address public owner;
    address public cofinanceContract;
    bool public poolIncentivized;

    modifier onlyCoFinance() {
        require(msg.sender == cofinanceContract, "LiquidityToken: Only CoFinance contract can call this function");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }
    function mint(address account, uint256 amount) external onlyCoFinance {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }

    function safeTransfer(address to, uint256 amount) external {
        _safeTransfer(msg.sender, to, amount);
    }

    function safeTransferFrom(address from, address to, uint256 amount) external {
        _safeTransfer(from, to, amount);
        approve(msg.sender, allowance(from, msg.sender) - amount);
    }

    function setCoFinanceContract(address _cofinanceContract) external {
        require(msg.sender == owner, "LiquidityToken: Only owner can set CoFinance contract");
        cofinanceContract = _cofinanceContract;
    }

    function _safeTransfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "ERC20: transfer to the zero address");
        require(balanceOf(from) >= amount, "ERC20: transfer amount exceeds balance");
        _transfer(from, to, amount);
    }
}



contract CoFinance {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 public tokenA;
    IERC20 public tokenB;
    LiquidityToken public liquidityToken;
    Staking public stakingContract;
    address public owner;
    IERC20 public rewardToken;
    IPriceFeed public priceFeed;

    uint256 public SWAP_FEE_PERCENT = 5; // 0.5% swap fee
    uint256 public MAX_LTV_PERCENT = 80; // 80% maximum loan-to-value ratio
    uint256 public INTEREST_RATE = 5; // 5% interest rate per month
    uint256 public constant SECONDS_IN_30_DAYS = 30 days;
    uint256 public constant SECONDS_IN_90_DAYS = 90 days;
    uint256 public constant SECONDS_IN_7_DAYS = 7 days;
    uint256 public constant SECONDS_IN_14_DAYS = 14 days;
    uint256 public constant SECONDS_IN_21_DAYS = 21 days;

    uint256 public APR_7_DAYS = 20; // 20% APR for 7 days
    uint256 public APR_14_DAYS = 30; // 40% APR for 14 days
    uint256 public APR_21_DAYS = 50; // 60% APR for 21 days
    uint256 public totalStaked; // Total amount staked across all stakers
    uint256 public swapFeeBalance;
    uint256 public interestFeeBalance;
    uint256 public OWNER_SHARE_PERCENT = 10; // 10% of fees go to owner

    bool public isPoolIncentivized; // Flag to indicate if the pool is incentivized
    mapping(address => uint256) public stakerRewards; // Rewards accumulated by stakers
    mapping(address => uint256) public balances;
    mapping(address => uint256) public borrowed;
    mapping(address => uint256) public collateralA; 
    mapping(address => uint256) public collateralB; 
    mapping(address => uint256) public loanStartTime;
    mapping(address => uint256) public loanDuration;
    mapping(address => address) public borrowedToken;

    event TokensSwapped(address indexed swapper, uint256 tokenAAmount, uint256 tokenBAmount, uint256 feeAmount);
    event LiquidityProvided(address indexed provider, uint256 tokenAAmount, uint256 tokenBAmount, uint256 liquidityTokensMinted);
    event TokensBorrowed(address indexed borrower, uint256 tokenAAmount, uint256 tokenBAmount, uint256 duration);
    event CollateralDeposited(address indexed depositor, address indexed tokenAddress, uint256 amount);
    event CollateralWithdrawn(address indexed withdrawer, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount);
    event CollateralLiquidated(address indexed borrower, uint256 collateralAmount);
    event TokensStaked(address indexed staker, uint256 amount, uint256 duration);
    event TokensUnstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 rewardAmount);
    event WithdrawLiquidity(address indexed exiter, uint256 tokenAAmount, uint256 tokenBAmount);
    event SwapFeeWithdrawn(address indexed owner, uint256 amount);
    event InterestFeeWithdrawn(address indexed owner, uint256 amount);
    event IncentiveDeposited(address indexed depositor, uint256 amount);
    event LiquidityTokensMinted(address recipient, uint256 amount);
    event LiquidityTokensSent(address recipient, uint256 amount);


    constructor(
        address _tokenA,
        address _tokenB,
        address _rewardToken,
        address _priceFeed,
        address _liquidityToken,
        address _stakingContract,
        bool _isPoolIncentivized

         ) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        rewardToken = IERC20(_rewardToken);
        owner = msg.sender;
        priceFeed = IPriceFeed(_priceFeed);
        liquidityToken = LiquidityToken(_liquidityToken);
        stakingContract = Staking(_stakingContract);
        isPoolIncentivized = _isPoolIncentivized;
    }

    function depositIncentive(uint256 amount) public {
        require(isPoolIncentivized, "Pool is not incentivized");
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        emit IncentiveDeposited(msg.sender, amount);
    }

    function swapTokens(address tokenAddress, uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        if (address(priceFeed) == address(0)) {
            _ammSwap(tokenAddress, tokenAmount);
        } else {
            _dynamicSwap(tokenAddress, tokenAmount);
            }
    }

    function _ammSwap(address tokenAddress, uint256 tokenAmount) internal {
        uint256 tokenAFee;
        uint256 tokenBFee;
        uint256 tokenAAmountAfterFee;
        uint256 tokenBAmountAfterFee;
        if (tokenAddress == address(tokenA)) {
            tokenAFee = tokenAmount.mul(SWAP_FEE_PERCENT).div(1000);
            tokenAAmountAfterFee = tokenAmount.sub(tokenAFee);
            tokenA.safeTransferFrom(msg.sender, address(this), tokenAmount);
            swapFeeBalance = swapFeeBalance.add(tokenAFee);
            tokenB.safeTransfer(msg.sender, tokenAAmountAfterFee);
            emit TokensSwapped(msg.sender, tokenAmount, 0, tokenAFee);
        } else if (tokenAddress == address(tokenB)) {
            tokenBFee = tokenAmount.mul(SWAP_FEE_PERCENT).div(1000); 
            tokenBAmountAfterFee = tokenAmount.sub(tokenBFee);
            tokenB.safeTransferFrom(msg.sender, address(this), tokenAmount);
            swapFeeBalance = swapFeeBalance.add(tokenBFee);
            tokenA.safeTransfer(msg.sender, tokenBAmountAfterFee);
            emit TokensSwapped(msg.sender, 0, tokenAmount, tokenBFee);
        } else {
            revert("Invalid token address provided");
        }
    }

    function _dynamicSwap(address tokenAddress, uint256 tokenAmount) internal {
        uint256 tokenAFee;
        uint256 tokenBFee;
        uint256 tokenAAmountAfterFee;
        uint256 tokenBAmountAfterFee;
        uint256 price = priceFeed.getTokenAPrice(); 
        if (tokenAddress == address(tokenA)) {
            tokenAFee = tokenAmount.mul(SWAP_FEE_PERCENT).div(1000).mul(price).div(1e18);
            tokenAAmountAfterFee = tokenAmount.sub(tokenAFee);
            tokenA.safeTransferFrom(msg.sender, address(this), tokenAmount);
            swapFeeBalance = swapFeeBalance.add(tokenAFee);
            tokenB.safeTransfer(msg.sender, tokenAAmountAfterFee);
            emit TokensSwapped(msg.sender, tokenAmount, 0, tokenAFee);
        } else if (tokenAddress == address(tokenB)) {
            tokenBFee = tokenAmount.mul(SWAP_FEE_PERCENT).div(1000).mul(price).div(1e18); 
            tokenBAmountAfterFee = tokenAmount.sub(tokenBFee);
            tokenB.safeTransferFrom(msg.sender, address(this), tokenAmount);
            swapFeeBalance = swapFeeBalance.add(tokenBFee);
            tokenA.safeTransfer(msg.sender, tokenBAmountAfterFee);
            emit TokensSwapped(msg.sender, 0, tokenAmount, tokenBFee);
        } else {
            revert("Invalid token address provided");
        }
    }
    function provideLiquidity(uint256 tokenAAmount, uint256 tokenBAmount) external {
        require(tokenAAmount > 0 && tokenBAmount > 0, "Token amounts must be greater than 0");
        tokenA.safeTransferFrom(msg.sender, address(this), tokenAAmount);
        tokenB.safeTransferFrom(msg.sender, address(this), tokenBAmount);
        uint256 liquidityMinted;
        uint256 liquidityTotalSupply = liquidityToken.totalSupply();
        if (liquidityTotalSupply == 0) {
            liquidityMinted = tokenAAmount.mul(tokenBAmount);
        } else {
            uint256 reserveA = tokenA.balanceOf(address(this));
            uint256 reserveB = tokenB.balanceOf(address(this));
            uint256 liquidityA = tokenAAmount.mul(liquidityTotalSupply).div(reserveA);
            uint256 liquidityB = tokenBAmount.mul(liquidityTotalSupply).div(reserveB);
            liquidityMinted = liquidityA < liquidityB ? liquidityA : liquidityB;
        }
        liquidityToken.mint(address(this), liquidityMinted);
        sendLiquidityTokens(msg.sender, liquidityMinted);
        emit LiquidityProvided(msg.sender, tokenAAmount, tokenBAmount, liquidityMinted);
    }

    function sendLiquidityTokens(address recipient, uint256 amount) internal {
        liquidityToken.transfer(recipient, amount);
        emit LiquidityTokensSent(recipient, amount);(recipient, amount);
    }

    function withdrawLiquidity(uint256 liquidityTokenAmount) external {
        require(liquidityTokenAmount > 0, "Liquidity token amount must be greater than 0");
        liquidityToken.burn(msg.sender, liquidityTokenAmount);
        tokenA.safeTransfer(msg.sender, 0);
        tokenB.safeTransfer(msg.sender, 0);
        emit WithdrawLiquidity(msg.sender, 0, 0);
    }

    function borrowTokens(address tokenAddress, uint256 tokenAmount, uint256 duration) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        require(duration == SECONDS_IN_30_DAYS || duration == SECONDS_IN_90_DAYS, "Invalid loan duration");

        uint256 loanAmount;
        IERC20 collateralToken;
        IERC20 borrowToken;

        if (tokenAddress == address(tokenA)) {
            loanAmount = tokenAmount;
            collateralToken = tokenB;
            borrowToken = tokenA;
        } else if (tokenAddress == address(tokenB)) {
            loanAmount = tokenAmount;
            collateralToken = tokenA;
            borrowToken = tokenB;
        } else {
            revert("Invalid token address provided");
        }

        uint256 collateralAmountRequired = loanAmount.mul(100).div(MAX_LTV_PERCENT);
        require(collateralToken.balanceOf(msg.sender) >= collateralAmountRequired, "Insufficient collateral");

        collateralToken.safeTransferFrom(msg.sender, address(this), collateralAmountRequired);
        borrowToken.safeTransfer(msg.sender, tokenAmount);

        if (tokenAddress == address(tokenA)) {
            collateralB[msg.sender] = collateralB[msg.sender].add(collateralAmountRequired);
        } else {
            collateralA[msg.sender] = collateralA[msg.sender].add(collateralAmountRequired);
        }

        borrowed[msg.sender] = borrowed[msg.sender].add(loanAmount);
        loanStartTime[msg.sender] = block.timestamp;
        loanDuration[msg.sender] = duration;
        borrowedToken[msg.sender] = address(borrowToken);

        emit TokensBorrowed(msg.sender, loanAmount, 0, duration);
    }

    function repayLoan(uint256 loanAmount) external {
        require(borrowed[msg.sender] > 0, "No tokens borrowed");
        require(loanAmount > 0, "Loan amount must be greater than 0");
        tokenA.safeTransferFrom(msg.sender, address(this), loanAmount);
        borrowed[msg.sender] = borrowed[msg.sender].sub(loanAmount);
        interestFeeBalance = interestFeeBalance.add(loanAmount.mul(INTEREST_RATE).div(100).mul(block.timestamp.sub(loanStartTime[msg.sender])).div(365 days));
        emit LoanRepaid(msg.sender, loanAmount);
    }

    function addcollateralize(address tokenAddress, uint256 amount) external {
        require(amount > 0, "Collateral amount must be greater than 0");

        if (tokenAddress == address(tokenA)) {
            tokenA.safeTransferFrom(msg.sender, address(this), amount);
            collateralA[msg.sender] = collateralA[msg.sender].add(amount);
        } else if (tokenAddress == address(tokenB)) {
            tokenB.safeTransferFrom(msg.sender, address(this), amount);
            collateralB[msg.sender] = collateralB[msg.sender].add(amount);
        } else {
            revert("Invalid token address provided");
        }

        emit CollateralDeposited(msg.sender, tokenAddress, amount);
    }

    function withdrawCollateralA(uint256 collateralAmount) external {
        require(collateralAmount > 0, "Collateral amount must be greater than 0");
        require(collateralAmount <= collateralA[msg.sender], "Not enough collateral A");
        collateralA[msg.sender] = collateralA[msg.sender].sub(collateralAmount);
        tokenA.safeTransfer(msg.sender, collateralAmount);
        emit CollateralWithdrawn(msg.sender, collateralAmount);
    }

    function withdrawCollateral(uint256 amount) external {
        require(collateralA[msg.sender] >= amount || collateralB[msg.sender] >= amount, "Insufficient collateral");

        if (collateralA[msg.sender] >= amount) {
            collateralA[msg.sender] = collateralA[msg.sender].sub(amount);
            tokenA.safeTransfer(msg.sender, amount);
        } else {
            collateralB[msg.sender] = collateralB[msg.sender].sub(amount);
            tokenB.safeTransfer(msg.sender, amount);
        }

        emit CollateralWithdrawn(msg.sender, amount);
    }

    function liquidateCollateral() external {
        uint256 collateralAmount = collateralA[msg.sender].add(collateralB[msg.sender]);
        require(collateralAmount > 0, "No collateral to liquidate");
        collateralA[msg.sender] = 0;
        collateralB[msg.sender] = 0;
        tokenA.safeTransfer(owner, collateralAmount);
        emit CollateralLiquidated(msg.sender, collateralAmount);
    }

    function getMaxLoanAmount() public view returns (uint256) {
        uint256 totalCollateral = collateralA[msg.sender].add(collateralB[msg.sender]);
        return totalCollateral.mul(MAX_LTV_PERCENT).div(100);
    }

    function stakeTokens(uint256 amount, uint256 duration) external {
        require(amount > 0, "Amount must be greater than 0");
        require(duration == SECONDS_IN_7_DAYS || duration == SECONDS_IN_14_DAYS || duration == SECONDS_IN_21_DAYS, "Invalid staking duration");
        totalStaked += 1;
        liquidityToken.safeTransferFrom(msg.sender, address(this), amount);
        stakingContract.stake(msg.sender, amount, duration);
        emit TokensStaked(msg.sender, amount, duration);
    }

    function unstakeTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        stakingContract.unstake(msg.sender, amount);
        liquidityToken.burn(msg.sender, amount);
        totalStaked -= 1;
        emit TokensUnstaked(msg.sender, amount);
    }

    function claimRewards() external {
        uint256 rewardAmount = calculateReward(msg.sender);
        require(rewardAmount > 0, "No rewards to claim");
        rewardToken.safeTransfer(msg.sender, rewardAmount);
        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    function calculateReward(address staker) public view returns (uint256) {
        uint256 stakedAmount = stakingContract.stakedBalance(staker);
        uint256 rewardRate;
        uint256 stakeDuration = stakingContract.stakingDuration(staker);
        if (stakeDuration < SECONDS_IN_7_DAYS) {
            rewardRate = APR_7_DAYS;
        } else if (stakeDuration < SECONDS_IN_14_DAYS) {
            rewardRate = APR_14_DAYS;
        } else if (stakeDuration < SECONDS_IN_21_DAYS) {
            rewardRate = APR_21_DAYS;
        }else {
            return 0;
        }
        uint256 reward = stakedAmount.mul(rewardRate).mul(stakeDuration).div(365 days);
        return reward;
    }

    function withdrawSwapFee() external {
        require(msg.sender == owner, "Only owner can withdraw swap fee");
        uint256 amount = swapFeeBalance.mul(OWNER_SHARE_PERCENT).div(100);
        swapFeeBalance = swapFeeBalance.sub(amount);
        tokenA.safeTransfer(owner, amount);
        emit SwapFeeWithdrawn(owner, amount);
    }

    function withdrawInterestFee() external {
        require(msg.sender == owner, "Only owner can withdraw interest fee");
        uint256 amount = interestFeeBalance.mul(OWNER_SHARE_PERCENT).div(100);
        interestFeeBalance = interestFeeBalance.sub(amount);
        tokenA.safeTransfer(owner, amount);
        emit InterestFeeWithdrawn(owner, amount);
    }

    function updateSwapFee(uint256 newFeePercent) external {
        require(msg.sender == owner, "Only owner can update swap fee");
        SWAP_FEE_PERCENT = newFeePercent;
    }

    function updateOwnerShare(uint256 newOwnerSharePercent) external {
        require(msg.sender == owner, "Only owner can update owner share");
        OWNER_SHARE_PERCENT = newOwnerSharePercent;
    }

    function updateIncentivizedPool(bool incentivized) external {
        require(msg.sender == owner, "Only owner can update pool incentives");
        isPoolIncentivized = incentivized;
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
            if (x <= 3) return 1;
            uint256 z = (x + 1) / 2;
            y = x;
            while (z < y) {
                y = z;
                z = (x / z + z) / 2;
            }
    }

}
