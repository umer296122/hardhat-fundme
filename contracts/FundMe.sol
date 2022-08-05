//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./priceConverter.sol";

contract FundMe {
    using priceConverter for uint256;
    uint256 minimumUSD = 50 * 1e18;
    address[] public funders;
    address public owner;
    mapping(address => uint256) public addressToAmountFunded;
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversationRate(priceFeed) >= minimumUSD,
            "Do'not send enough"
        );

        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        //transfer
        payable(msg.sender).transfer(address(this).balance);
        //send
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, " SEND FAILD");
        //call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "CALL FAILD");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "SENDER IS NOT OWNER");
        _;
    }
}
