// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {

  //WolftTokenTx
  const WolftTokenTx = await hre.ethers.getContractFactory('WolftTokenTx');
  const wolftTokenTx = await WolftTokenTx.deploy();
  await wolftTokenTx.deployed();
  console.log('WolftTokenTx deployed to:', wolftTokenTx.address);

  //WolftToken
  const WolftToken = await hre.ethers.getContractFactory('WolftToken');
  const wolftToken = await WolftToken.deploy();
  await wolftToken.deployed();
  console.log('WolftToken deployed to:', wolftToken.address);

  //WolftTokenLock
  let timeLock = 1672531201;
  const WolftTokenLock = await hre.ethers.getContractFactory('WolftTokenLock');
  const wolftTokenLock = await WolftTokenLock.deploy(timeLock);
  await wolftTokenLock.deployed();
  console.log('WolftTokenLock deployed to:', wolftTokenLock.address);

  //WolfSwap
  const WolfSwap = await hre.ethers.getContractFactory('WolfSwap');
  const wolfSwap = await WolfSwap.deploy(wolftToken.address);
  await wolfSwap.deployed();
  console.log('WolfSwap deployed to:', wolfSwap.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
