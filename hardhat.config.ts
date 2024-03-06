import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-typechain'
import { task, types } from 'hardhat/config'
import { MaxUint128 } from './test/shared/utilities'
const sleep = require('util').promisify(setTimeout)
const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    'test test test test test test test test test test test junk',
  accountsBalance: '990000000000000000000',
}

task('add-fee-tier', 'Add fee tier')
  .addParam('fee', 'Fee', 100, types.int)
  .addParam('tickSpacing', 'Tick Spacing', 1, types.int)
  .setAction(async (taskArgs, hre) => {
    const { fee, tickSpacing } = taskArgs
    const { getNamedAccounts, ethers, deployments } = hre
    const factory = await ethers.getContract('UniswapV3Factory')
    await factory.enableFeeAmount(fee, tickSpacing)
    console.log('Enabled fee amount')
  })

task('set-fee-protocol', 'Set fee protocol')
  // .addParam(
  //   'poolAddresses',
  //   'Pool Addresses'
  // )
  .addParam('feeProtocol0', 'Fee Protocol 0', 4, types.int)
  .addParam('feeProtocol1', 'Fee Protocol 1', 4, types.int)
  .setAction(async (taskArgs, hre) => {
    const poolAddresses: string[] = [
      '0xc4876eb31624a51888a2916f2d365b881ba9a8a3', // BRETT
      // '0x6ece85052db0e29baf309361db2abfa65ea258bf', // TOSHI
      // '0x65488ed876fa62489569abc73b6005a0a3f64150', // KRAV
      // '0xa166e14e5bc66656f1514a45877497767506338c', // BALD 2.0
      // '0x8efefcb548c9316c2367d6065e33e8d138e4137e', // EDE
      // '0x24702ca4a4bedbe17ac5191a461143b542889750', // MEOW
    ]

    const { feeProtocol0, feeProtocol1 } = taskArgs
    const { ethers } = hre

    for (const poolAddress of poolAddresses) {
      const pool = await ethers.getContractAt('UniswapV3Pool', poolAddress)
      await (await pool.setFeeProtocol(feeProtocol0, feeProtocol1)).wait()
      // await sleep(10000)
      console.log(`Fee protocol set for pool ${poolAddress}`)
    }

    console.log(`Fee protocol set for pool addresses ${poolAddresses}`)
  })

task('collect', 'Collect')
  // .addParam(
  //   'poolAddresses',
  //   'Pool Addresses'
  // )
  .addParam(
    'amount0Requested',
    'Amount 0 Requested',
    MaxUint128.toString(),
    types.string,
  )
  .addParam(
    'amount1Requested',
    'Amount 1 Requested',
    MaxUint128.toString(),
    types.string,
  )
  .setAction(async (taskArgs, hre) => {
    const deployer = '0xf87BC5535602077d340806D71f805EA9907a843D'
    const poolAddresses: string[] = [
      '0xc4876eb31624a51888a2916f2d365b881ba9a8a3', // BRETT
      '0x6ece85052db0e29baf309361db2abfa65ea258bf', // TOSHI
      // '0x5f0a153a64fd734c111b770da11de2c385ca8042', // BALD
      '0x23e55d60b685d794ec83d0f9489bc5ce027ebc7b', // TOSHI
      // '0x5c279b6f7b300570a923ab17cd2f405848b9e5dd', // YOU
      '0x7ca35c2e6ba391ad2adc82413c052f3652d32c14', // LMEOW
      '0x13def4568165d56b42b8259e544b74383f4407d7', // MOCHI
      '0x7aa3bc844710220272d9e14cb4b4bb067953d8ac', // axlUSDC
      // '0x83c52776efe5f60efec721e5b3750993c514f817', // SMUDCAT
      // '0x693143e78f4207ef0536620a87e2befa80a46f3f', // BAPE
      // '0x54687e4454ba40833898272efea031ac5e9e541a', // BaseF
      // '0xade9866a86372ce6ce4ec8562455bc7235037c88', // COIN
      // '0x65488ed876fa62489569abc73b6005a0a3f64150', // KRAV
      // '0xa166e14e5bc66656f1514a45877497767506338c', // BALD 2.0
      // '0x8efefcb548c9316c2367d6065e33e8d138e4137e', // EDE
      // '0x24702ca4a4bedbe17ac5191a461143b542889750', // MEOW
    ]
    const { amount0Requested, amount1Requested } = taskArgs
    const { ethers } = hre
    for (const poolAddress of poolAddresses) {
      const pool = await ethers.getContractAt('UniswapV3Pool', poolAddress)
      await (
        await pool.collectProtocol(deployer, amount0Requested, amount1Requested)
      ).wait()
      console.log(`Fees collected for pool ${poolAddress}`)
    }
    console.log(`Fees collected for pool addresses ${poolAddresses}`)
  })

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts,
      chainId: 1,
      live: true,
      saveDeployments: true,
    },
    fantom: {
      url: 'https://rpcapi.fantom.network',
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
    },
    polygon: {
      url: 'https://rpc-mainnet.maticvigil.com',
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    gnosis: {
      url: 'https://rpc.ankr.com/gnosis',
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      // gasPrice: 470000000000,
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts,
      chainId: 42161,
      live: true,
      saveDeployments: true,
      blockGasLimit: 700000,
    },
    celo: {
      url: 'https://forno.celo.org',
      accounts,
      chainId: 42220,
      live: true,
      saveDeployments: true,
    },
    moonriver: {
      url: 'https://rpc.moonriver.moonbeam.network',
      accounts,
      chainId: 1285,
      live: true,
      saveDeployments: true,
    },
    moonbeam: {
      url: 'https://rpc.api.moonbeam.network',
      accounts,
      chainId: 1284,
      live: true,
      saveDeployments: true,
    },
    fuse: {
      url: 'https://rpc.fuse.io',
      accounts,
      chainId: 122,
      live: true,
      saveDeployments: true,
    },
    optimism: {
      url: 'https://mainnet.optimism.io',
      accounts,
      chainId: 10,
      live: true,
      saveDeployments: true,
    },
    kava: {
      url: 'https://evm.kava.io',
      accounts,
      chainId: 2222,
      live: true,
      saveDeployments: true,
    },
    metis: {
      url: 'https://andromeda.metis.io/?owner=1088',
      accounts,
      chainId: 1088,
      live: true,
      saveDeployments: true,
    },
    'arbitrum-nova': {
      url: 'https://nova.arbitrum.io/rpc',
      accounts,
      chainId: 42170,
      live: true,
      saveDeployments: true,
    },
    boba: {
      url: 'https://mainnet.boba.network',
      accounts,
      chainId: 288,
      live: true,
      saveDeployments: true,
    },
    'boba-avax': {
      url: 'https://avax.boba.network',
      accounts,
      chainId: 43288,
      live: true,
      saveDeployments: true,
    },
    bttc: {
      url: 'https://rpc.bittorrentchain.io',
      accounts,
      chainId: 199,
      live: true,
      saveDeployments: true,
    },
    'boba-bnb': {
      url: 'https://bnb.boba.network',
      accounts,
      chainId: 56288,
      live: true,
      saveDeployments: true,
    },
    polygonzkevm: {
      url: 'https://zkevm-rpc.com',
      accounts,
      chainId: 1101,
      live: true,
      saveDeployments: true,
    },
    thundercore: {
      url: 'https://mainnet-rpc.thundertoken.net',
      accounts,
      chainId: 108,
      live: true,
      saveDeployments: true,
    },
    filecoin: {
      url: 'https://rpc.ankr.com/filecoin',
      accounts,
      chainId: 314,
      live: true,
      saveDeployments: true,
    },
    haqq: {
      url: 'https://rpc.eth.haqq.network',
      accounts,
      chainId: 11235,
      live: true,
      saveDeployments: true,
    },
    core: {
      url: 'https://rpc.coredao.org',
      accounts,
      chainId: 1116,
      live: true,
      saveDeployments: true,
    },
    linea: {
      url: 'https://rpc.linea.build',
      accounts,
      chainId: 59144,
      live: true,
      saveDeployments: true,
    },
    base: {
      url: 'https://developer-access-mainnet.base.org',
      accounts,
      chainId: 8453,
      live: true,
      saveDeployments: true,
    },
    zetachain: {
      url: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
      accounts,
      chainId: 7000,
      live: true,
      saveDeployments: true
    }
    // ropsten: {
    //   url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // kovan: {
    //   url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // arbitrumRinkeby: {
    //   url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // arbitrum: {
    //   url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // optimismKovan: {
    //   url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // optimism: {
    //   url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // polygon: {
    //   url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    // },
    // bnb: {
    //   url: `https://bsc-dataseed.binance.org/`,
    // },
  },
  namedAccounts: {
    // e.g. ledger://0x18dd4e0Eb8699eA4fee238dE41ecF115e32272F8
    deployer: process.env.LEDGER || { default: 0 },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    carol: {
      default: 3,
    },
    dev: {
      default: 4,
    },
    feeTo: {
      default: 5,
    },
  },

  etherscan: {
    customChains: [
      {
        network: 'kava',
        chainId: 2222,
        urls: {
          apiURL: 'https://explorer.kava.io/api',
          browserURL: 'https://explorer.kava.io',
        },
      },
      {
        network: 'metis',
        chainId: 1088,
        urls: {
          apiURL: 'https://andromeda-explorer.metis.io/api',
          browserURL: 'https://andromeda-explorer.metis.io',
        },
      },
      {
        network: 'arbitrum-nova',
        chainId: 42170,
        urls: {
          apiURL: 'https://api-nova.arbiscan.io/api',
          browserURL: 'https://arbiscan.io',
        },
      },
    ],
    apiKey: {
      'arbitrum-nova': '51WQTEN9E1G6191V8MWC5ZGBNWKSBKY2FB',
      // mainnet: process.env.ETHERSCAN_API_KEY || '',
      // ropsten: process.env.ETHERSCAN_API_KEY || '',
      // rinkeby: process.env.ETHERSCAN_API_KEY || '',
      // goerli: process.env.ETHERSCAN_API_KEY || '',
      // kovan: process.env.ETHERSCAN_API_KEY || '',
      // // binance smart chain
      // bsc: process.env.BSCSCAN_API_KEY || '',
      // bscTestnet: process.env.BSCSCAN_API_KEY || '',
      // // huobi eco chain
      // heco: process.env.HECOINFO_API_KEY || '',
      // hecoTestnet: process.env.HECOINFO_API_KEY || '',
      // // fantom mainnet
      // opera: process.env.FTMSCAN_API_KEY || '',
      // ftmTestnet: process.env.FTMSCAN_API_KEY || '',
      // // optimism
      // optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || '',
      // optimisticKovan: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || '',
      // // polygon
      // polygon: process.env.POLYGONSCAN_API_KEY || '',
      // polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      // // arbitrum
      // arbitrumOne: process.env.ARBISCAN_API_KEY || '',
      // arbitrumTestnet: process.env.ARBISCAN_API_KEY || '',
      // // avalanche
      // avalanche: process.env.SNOWTRACE_API_KEY || '',
      // avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      // // moonbeam
      // moonbeam: process.env.MOONBEAM_MOONSCAN_API_KEY || '',
      // moonriver: process.env.MOONRIVER_MOONSCAN_API_KEY || '',
      // moonbaseAlpha: process.env.MOONBASE_MOONSCAN_API_KEY || '',
      // // harmony
      // harmony: process.env.HARMONY_API_KEY || '',
      // harmonyTest: process.env.HARMONY_API_KEY || '',
      // // xdai and sokol don't need an API key, but you still need
      // // to specify one; any string placeholder will work
      // xdai: 'api-key',
      // sokol: 'api-key',
      // aurora: 'api-key',
      // auroraTestnet: 'api-key',
      // metis: 'api-key',
      // // bobaAvax: 'api-key',
      // bttc: process.env.BTTC_API_KEY || '',
      // gnosis: process.env.GNOSIS_API_KEY || '',
    },
  },
  solidity: {
    version: '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        // do not include the metadata hash, since this is machine dependent
        // and we want all generated code to be deterministic
        // https://docs.soliditylang.org/en/v0.7.6/metadata.html
        bytecodeHash: 'none',
      },
    },
  },
}
