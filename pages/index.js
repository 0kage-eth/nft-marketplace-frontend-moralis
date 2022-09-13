import { useMoralisQuery, useMoralis } from "react-moralis"
import { useEffect } from "react"
import { NFTDisplayCard } from "../components/NFTDisplayCard"

const Home = () => {
    console.log("Home page!")

    // populate active NFT's on first page loading
    const {
        data: activeNFTs,
        error,
        isLoading: fetching,
    } = useMoralisQuery("ActiveNFT", (query) => query.limit(10).descending("tokenId"))

    const { isWeb3Enabled } = useMoralis()

    const nftListings = () => {
        return activeNFTs.map((nft, indx) => {
            const { tokenId, nftAddress, marketPlaceAddress, price, owner } = nft.attributes
            console.log(
                `token ${tokenId}, nftAddress ${nftAddress} price: ${price} ownwer: ${owner}`
            )
            return (
                <div>
                    {/* <div id={indx}>
                        nft address: {nftAddress}, token id: {tokenId}, owner: {owner}, price:{" "}
                        {price}
                    </div> */}
                    <NFTDisplayCard
                        price={price}
                        nftMarketplaceAddress={marketPlaceAddress}
                        tokenId={tokenId}
                        owner={owner}
                        nftAddress={nftAddress}
                    />
                </div>
            )
        })
    }
    return isWeb3Enabled ? (
        <div>{fetching ? <div>"Fetching NFT list..."</div> : nftListings()}</div>
    ) : (
        <div>"Enable Web3 by connecting your wallet!"</div>
    )
}

export default Home
