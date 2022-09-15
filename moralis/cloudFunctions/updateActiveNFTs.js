Moralis.Cloud.afterSave("NFTListed", async (request) => {
    // Every event gets triggered twice - so we have a field called 'confirmed'
    // first time an event is fired, 'confirmed' is false
    // then later, when block is confirmed, event is fired again, this time 'confirmed' is true

    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed transaction...")
    const confirmed = request.object.get("confirmed")

    if (confirmed) {
        logger.info("found a new NFT listing...")

        const ActiveNFT = Moralis.Object.extend("ActiveNFT")

        const activeNFT = new ActiveNFT()

        activeNFT.set("marketPlaceAddress", request.object.get("address"))
        activeNFT.set("nftAddress", request.object.get("nftAddress"))
        activeNFT.set("price", request.object.get("price"))
        activeNFT.set("tokenId", request.object.get("tokenId"))
        activeNFT.set("owner", request.object.get("owner"))

        logger.info(
            `Adding nft listing with address: ${request.object.get(
                "nftAddress"
            )} and owner: ${request.object.get("owner")}}`
        )

        logger.info("Saving...")
        await activeNFT.save()
    } else {
        logger.info("unconfirmed transaction... ")
    }
})

Moralis.Cloud.afterSave("NFTDelisted", async (request) => {
    const logger = Moralis.Cloud.getLogger()

    logger.info("Looking for confirmed NFTDelisted transations...")

    const confirmed = request.object.get("confirmed")
    if (confirmed) {
        logger.info("found a new confirmed NFT delisted item...")

        const activeNFT = Moralis.Object.extend("ActiveNFT")
        const query = new Moralis.Query(activeNFT)

        query.equalTo("marketPlaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        const delistedNft = await query.first()

        logger.info(`Delisted NFT is ${delistedNft}`)
        if (delistedNft) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )}....`
            )
            await delistedNft.destroy()
        } else {
            logger.info(
                `No active item found with address ${request.object.get(
                    "address"
                )} token id ${request.object.get("tokenId")}`
            )
        }
    } else {
        logger.info("item is unconfirmed as of now..")
    }
})

Moralis.Cloud.afterSave("NFTBought", async (request) => {
    const logger = Moralis.Cloud.getLogger()

    logger.info("Searching for confirmed NFT Bought items")

    const confirmed = request.object.get("confirmed")
    if (confirmed) {
        logger.info("Found a confirmed Bought item")
        const nftMarketPlaceAddress = request.object.get("address")
        const nftAddress = request.object.get("nftAddress")
        const tokenId = request.object.get("tokenId")

        const activeNFTTable = Moralis.Object.extend("ActiveNFT")
        const query = new Moralis.Query(activeNFTTable)

        logger.info(
            `Searching for nft with marketplace address ${nftMarketPlaceAddress}, nft address ${nftAddress} and token id ${tokenId}`
        )
        query.equalTo("marketPlaceAddress", nftMarketPlaceAddress)
        query.equalTo("nftAddress", nftAddress)
        query.equalTo("tokenId", tokenId)

        const activeNftItem = await query.first()

        if (activeNftItem) {
            logger.info(`Found active NFT with address ${nftAddress} and tokenId ${tokenId}`)
            await activeNftItem.destroy()
            logger.info(" NFT removed from ActiveNFT database...")
        } else {
            logger.info("active nft matching current bought NFT not found!")
        }
    } else {
        logger.info("Bought item detected but it is in unconfirmed state!")
    }
})

Moralis.Cloud.afterSave("NFTUpdated", async (request) => {
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed items in NFTUpdated Table")

    const confirmed = request.object.get("confirmed")
    if (confirmed) {
        logger.info("Found a confirmed item in NFTUpdated Table")

        const activeNFTTable = Moralis.Object.extend("ActiveNFT")

        const marketPlaceAddress = request.object.get("address")
        const nftAddress = request.object.get("nftAddress")
        const tokenId = request.object.get("tokenId")
        const newPrice = request.object.get("revisedPrice")
        const query = new Moralis.Query(activeNFTTable)

        query.equalTo("marketPlaceAddress", marketPlaceAddress)
        query.equalTo("nftAddress", nftAddress)
        query.equalTo("tokenId", tokenId)

        const activeNftItem = await query.first()
        logger.info(
            `Searching for nft in ActiveNFT table with marketplace address ${marketPlaceAddress}, nftAddress is ${nftAddress}, tokenId is ${tokenId}`
        )
        if (activeNftItem) {
            const oldPrice = activeNftItem.get("price")

            logger.info("Found Active NFT")
            logger.info("updating price....")
            activeNftItem.set("price", request.object.get("revisedPrice"))

            await activeNftItem.save()
            logger.info(
                `Price of nft in ActiveNFT table with address ${nftAddress} updated from ${oldPrice} to ${newPrice}`
            )
        } else {
            logger.info(
                `No match in ActiveNFTTable with marketplace address ${nftMarketPlaceAddress}, nft address ${nftAddress} and token id ${tokenId}`
            )
        }
    } else {
        logger.info("Item saved in NFTUpdatedTable is not confirmed yet! Skipping execution...")
    }
})
