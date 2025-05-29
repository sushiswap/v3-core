import { ethers } from "hardhat";
import PoolArtifact from "../artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";

async function main() {
  const hash = ethers.utils.keccak256(PoolArtifact.bytecode as string);
  console.log("POOL_INIT_CODE_HASH =", hash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});