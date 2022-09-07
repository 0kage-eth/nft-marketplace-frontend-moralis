const contractAddresses = require("../../constants/networkMapping.json")
const Moralis = require("moralis-v1/node")
require("dotenv").config()

const chainId = process.env.chainId

const moralisChainId = chainId == "31337" ? "1337" : chainId // moralis understands 1337 as chain Id

const contractAddressList = contractAddresses[chainId]["NftMarketPlace"]
const contractAddress = contractAddressList[contractAddressList.length - 1]

const serverURL = process.env.NEXT_PUBLIC_DAPPURL
const appId = process.env.NEXT_PUBLIC_APPID
const masterKey = process.env.NEXT_PUBLIC_MASTERKEY

const main = async () => {
  // start moralis server

  console.log("server url", serverURL)
  console.log("appId", appId)

  await Moralis.start({
    serverUrl: serverURL,
    appId: appId,
    masterKey: masterKey,
  })

  let nftListedOptions = {
    chainId: moralisChainId,
    sync_historical: true,
    topic: "NFTListed(address,address,uint256,uint256)",
    address: contractAddress,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "NFTListed",
      type: "event",
    },
    tableName: "NFTListed",
  }

  let nftBoughtOptions = {
    sync_historical: true,
    address: contractAddress,
    topic: "NFTBought(address,address,uint256,uint256)",
    chainId: moralisChainId,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      name: "NFTBought",
      type: "event",
    },
    tableName: "NFTBought",
  }

  let NftUpdatedOptions = {
    address: contractAddress,
    sync_historical: true,
    chainId: moralisChainId,
    topic: "NFTUpdated(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "revisedPrice",
          type: "uint256",
        },
      ],
      name: "NFTUpdated",
      type: "event",
    },
    tableName: "NFTUpdated",
  }

  let NftDelistedOptions = {
    address: contractAddress,
    sync_historical: true,
    chainId: moralisChainId,
    topic: "NFTDelisted(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "listingPrice",
          type: "uint256",
        },
      ],
      name: "NFTDelisted",
      type: "event",
    },
    tableName: "NFTDelisted",
  }

  let WithdrawBalanceOptions = {
    address: contractAddress,
    sync_historical: true,
    chainId: moralisChainId,
    topic: "withdrawBalance(address, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "withdrawer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "withdrawAmount",
          type: "uint256",
        },
      ],
      name: "WithdrawBalance",
      type: "event",
    },
    tableName: "WithdrawBalance",
  }

  const nftListedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    nftListedOptions,
    { useMasterKey: true }
  )

  const nftBoughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    nftBoughtOptions,
    { useMasterKey: true }
  )

  const nftUpdatedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    NftUpdatedOptions,
    { useMasterKey: true }
  )

  const nftDelistedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    NftDelistedOptions,
    { useMasterKey: true }
  )

  const withdrawBalanceResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    WithdrawBalanceOptions,
    { useMasterKey: true }
  )

  if (
    nftListedResponse.success &&
    nftBoughtResponse.success &&
    nftUpdatedResponse.success &&
    nftDelistedResponse.success &&
    withdrawBalanceResponse.success
  ) {
    console.log("Event watchers successfully registered in moralis database")
  } else {
    console.log(
      "Something went wrong while adding watchers to moralis database"
    )
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
