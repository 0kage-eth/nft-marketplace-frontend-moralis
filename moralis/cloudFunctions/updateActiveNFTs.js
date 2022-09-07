Moralis.Cloud.afterSave =
  ("NFTListed",
  async (request) => {
    // Every event gets triggered twice - so we have a field called 'confirmed'
    // first time an event is fired, 'confirmed' is false
    // then later, when block is confirmed, event is fired again, this time 'confirmed' is true

    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed transaction...")
    const confirmed = request.object.get(confirmed)

    if (confirmed) {
      logger.info("found a new NFT listing...")

      const ActiveNFT = Moralis.Object.extend("ActiveNFT")

      const activeNFT = new ActiveNFT()

      activeNFT.set("marketPlaceAddress", request.object.get("address"))
      activeNFT.set("nftAddress", request.object.get("nftAddress"))
      activeNFT.set("owner", request.object.get("owner"))
      activeNFT.set("tokenId", request.object.get("tokenId"))
      activeNFT.set("price", request.object.get("price"))

      logger.info(
        `Adding nft listing with address: ${request.object.get(
          "nftAddress"
        )} and owner: ${request.object.get("owner")}}`
      )

      logger.info("Saving...")
      await activeNFT.save()
    }
  })
