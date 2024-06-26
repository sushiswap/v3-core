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
      // ETHEREUM
      // '0x87c7056bbe6084f03304196be51c6b90b6d85aa2', // SUSHI/ETH
      // POLYGON
      // '0x8cfaab34f5159abf9c35587ac40d09a05dc94765', // USDC.e/USDT
      // '0x21988c9cfd08db3b5793c2c6782271dc94749251', // MATIC/USDC.e
      // '0x4646e8a5e1d14e2da01577822d6346c7883c6890', // USDC.e/DAI
      // '0xf1a12338d39fc085d8631e1a745b5116bc9b2a32', // MATIC/WETH
      // '0xc6ba44891cd95efc3929a428242f97bd9b735eb1', // USDC.e/USDC
      // '0x0e3eaef09dfe55824a3cda7146a387af261d7824', // USDC/NPM
      // '0xff5713fdbad797b81539b5f9766859d4e050a6cc', // SUSHI/WETH
      // '0xaabfa6dc0541033c1a2eb685f358d0ea937bb026', // PKR/USDC.e
      // '0x1b0585fc8195fc04a46a365e670024dfb63a960c', // USDC.e/WETH
      // SCROLL
      // '0xae5aa896bb93f4c7c5660b7fc894b3892255d015', // USDC/USDT
      // '0xe64ae4128e725868e8fe52e771e3d272e787b041', // USDC/ETH
      // '0x08d8b29864348f8d1b7266bf02879c9d0af04eba', // WBTC/ETH
      // CORE
      // '0x72d8e6d7307dcf11a3456b9f6fdfad05385b2f3e', // CORE/USDT 0.05
      // '0x0ace320a3441585274f7d7838045420771582595', // CORE/USDC 0.05
      // '0x599a68d45e6eed05aa8c5c0c85e7efeb5086d8e1', // USDT/USDC 0.01
      // ARBITRUM
      // '0xb3942c9ffa04efbc1fa746e146be7565c76e3dc1', // ETH/ARB 0.3
      // '0xd9e96f78b3c68ba79fd4dfad4ddf4f27bd1e2ecf', // USDT/USDC.e 0.01
      // '0x15e444da5b343c5a0931f5d3e85d158d1efc3d40', // ETH/USDC.e 0.05
      // '0xcda3b7bec56dbb562453231f142f63d3b00f8eb3', // USDC/USDC.e 0.05
      // '0x753d81a2d6c61dd7c3510729c9df310659f9003b', // ZTX/ETH 0.3
      // '0xe6ea93ba4ae9ee6520e55affebbdb38ed6c233a4', // ZTX/USDC 0.3
      // '0xb3aba1fb17ea51d909938c87f823fdfb0797a49b', // ETH/SUSHI 0.3
      // '0xb1aeb76b4e3e628ee54753ad4b8ef68c41e67a9f', // MAGIC/ETH 0.3
      // '0x9a528325cc76aec0da05b4a9b5a839fae6edd733', // ETH/SUSHI 1

      // BASE
      // '0x8e27128839aea978d65e98b28092367ade6048d8', // BEPE/WETH 0.3
      // '0x693143e78f4207ef0536620a87e2befa80a46f3f', // BAPE/WETH 1
      // '0x41595326aabe6132fc6c7ae71af087a3a9dbc9f6', // ETH/USDC
      // '0x22ca6d83ab887a535ae1c6011cc36ea9d1255c31', // ETH/USDbC
      // '0xf458af2f7dd6c9c1f6f65ab429d0f7bddb05bc4b', // ETH/MOCHI
      // '0x72c646067b11e9a7f94043a7f9a7c134db920129', // ETH/AYB
      // '0x65488ed876fa62489569abc73b6005a0a3f64150', // ETH/KRAV
      // '0xc4876eb31624a51888a2916f2d365b881ba9a8a3', // BRETT
      // '0x6ece85052db0e29baf309361db2abfa65ea258bf', // TOSHI
      // '0x65488ed876fa62489569abc73b6005a0a3f64150', // KRAV
      // '0xa166e14e5bc66656f1514a45877497767506338c', // BALD 2.0
      // '0x8efefcb548c9316c2367d6065e33e8d138e4137e', // EDE
      // '0x24702ca4a4bedbe17ac5191a461143b542889750', // MEOW

      // BLAST
      // '0x512f7e46c48b358429e6259fbec74ef6dd3bc565', // ORE/WETH 1
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
      // ETHEREUM
      // '0x87c7056bbe6084f03304196be51c6b90b6d85aa2', // SUSHI/ETH
      // POLYGON
      // '0x8cfaab34f5159abf9c35587ac40d09a05dc94765', // USDC.e/USDT
      // '0x21988c9cfd08db3b5793c2c6782271dc94749251', // MATIC/USDC.e
      // '0x4646e8a5e1d14e2da01577822d6346c7883c6890', // USDC.e/DAI
      // '0xf1a12338d39fc085d8631e1a745b5116bc9b2a32', // MATIC/WETH
      // '0xc6ba44891cd95efc3929a428242f97bd9b735eb1', // USDC.e/USDC
      // '0x0e3eaef09dfe55824a3cda7146a387af261d7824', // USDC/NPM
      // '0xff5713fdbad797b81539b5f9766859d4e050a6cc', // SUSHI/WETH
      // '0xaabfa6dc0541033c1a2eb685f358d0ea937bb026', // PKR/USDC.e
      // '0x1b0585fc8195fc04a46a365e670024dfb63a960c', // USDC.e/WETH
      // SCROLL
      // '0xae5aa896bb93f4c7c5660b7fc894b3892255d015', // USDC/USDT
      // '0xe64ae4128e725868e8fe52e771e3d272e787b041', // USDC/ETH
      // '0x08d8b29864348f8d1b7266bf02879c9d0af04eba', // WBTC/ETH
      // CORE
      // '0x72d8e6d7307dcf11a3456b9f6fdfad05385b2f3e', // CORE/USDT 0.05
      // '0x0ace320a3441585274f7d7838045420771582595', // CORE/USDC 0.05
      // '0x599a68d45e6eed05aa8c5c0c85e7efeb5086d8e1', // USDT/USDC 0.01
      // ARBITRUM
      // '0xb3942c9ffa04efbc1fa746e146be7565c76e3dc1', // ETH/ARB 0.3
      // '0xd9e96f78b3c68ba79fd4dfad4ddf4f27bd1e2ecf', // USDT/USDC.e 0.01
      // '0x15e444da5b343c5a0931f5d3e85d158d1efc3d40', // ETH/USDC.e 0.05
      // '0xcda3b7bec56dbb562453231f142f63d3b00f8eb3', // USDC/USDC.e 0.05
      // '0x753d81a2d6c61dd7c3510729c9df310659f9003b', // ZTX/ETH 0.3
      // '0xe6ea93ba4ae9ee6520e55affebbdb38ed6c233a4', // ZTX/USDC 0.3
      // '0xb3aba1fb17ea51d909938c87f823fdfb0797a49b', // ETH/SUSHI 0.3
      // '0xb1aeb76b4e3e628ee54753ad4b8ef68c41e67a9f', // MAGIC/ETH 0.3
      // '0x9a528325cc76aec0da05b4a9b5a839fae6edd733', // ETH/SUSHI 1

      // BASE
      // '0x8e27128839aea978d65e98b28092367ade6048d8', // BEPE/WETH 0.3
      // '0x693143e78f4207ef0536620a87e2befa80a46f3f', // BAPE/WETH 1
      // '0x41595326aabe6132fc6c7ae71af087a3a9dbc9f6', // ETH/USDC
      // '0x22ca6d83ab887a535ae1c6011cc36ea9d1255c31', // ETH/USDbC
      // '0xf458af2f7dd6c9c1f6f65ab429d0f7bddb05bc4b', // ETH/MOCHI
      // '0x72c646067b11e9a7f94043a7f9a7c134db920129', // ETH/AYB
      // '0x65488ed876fa62489569abc73b6005a0a3f64150', // ETH/KRAV
      // '0xc4876eb31624a51888a2916f2d365b881ba9a8a3', // BRETT
      // '0x6ece85052db0e29baf309361db2abfa65ea258bf', // TOSHI
      // '0x23e55d60b685d794ec83d0f9489bc5ce027ebc7b', // TOSHI
      // '0x7ca35c2e6ba391ad2adc82413c052f3652d32c14', // LMEOW
      // '0x13def4568165d56b42b8259e544b74383f4407d7', // MOCHI
      // '0x7aa3bc844710220272d9e14cb4b4bb067953d8ac', // axlUSDC
      // '0x5f0a153a64fd734c111b770da11de2c385ca8042', // BALD

      
      // '0x5c279b6f7b300570a923ab17cd2f405848b9e5dd', // YOU
      // '0x83c52776efe5f60efec721e5b3750993c514f817', // SMUDCAT
      // '0x693143e78f4207ef0536620a87e2befa80a46f3f', // BAPE
      // '0x54687e4454ba40833898272efea031ac5e9e541a', // BaseF
      // '0xade9866a86372ce6ce4ec8562455bc7235037c88', // COIN
      // '0x65488ed876fa62489569abc73b6005a0a3f64150', // KRAV
      // '0xa166e14e5bc66656f1514a45877497767506338c', // BALD 2.0
      // '0x8efefcb548c9316c2367d6065e33e8d138e4137e', // EDE
      // '0x24702ca4a4bedbe17ac5191a461143b542889750', // MEOW

      // BLAST
      // '0x512f7e46c48b358429e6259fbec74ef6dd3bc565', // ORE/WETH 1
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
      saveDeployments: true,
    },
    blast: {
      url: 'https://rpc.blast.io',
      accounts,
      chainId: 81457,
      live: true,
      saveDeployments: true,
    },
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
