const { run } = require("hardhat");
async function verify(contractAddress, args) {
  console.log | "Contract Verifying......";
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e.message);
    }
  }
}
module.exports = { verify };
