import Image from "next/image"
import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { useWeb3Contract } from "react-moralis"
import basicNftAbi from "../constants/BasicNFT.json"
import { Card } from "web3uikit"
import { ethers } from "ethers"
import UpdateNFTModal from "./UpdateNFTModal"

const showAddress = (address, showLength, separator) => {
    // showLength is length of shortened address
    if (showLength >= address.length) {
        return address
    }

    const separatorLength = separator.length

    const startLength = Math.ceil((showLength - separatorLength) / 2)

    const endLength = showLength - separatorLength - startLength

    return (
        address.substring(0, startLength) +
        separator +
        address.substring(address.length - endLength)
    )
}

export const NFTDisplayCard = ({ nftMarketplaceAddress, nftAddress, price, tokenId, owner }) => {
    const [imgUrl, setImgUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [showModal, setShowModal] = useState(false)

    const hideUpdateModal = () => {
        setShowModal(false)
    }
    const { isWeb3Enabled, account } = useMoralis()
    console.log("nft address inside display", nftAddress)
    console.log("token id inside display", tokenId)
    console.log("is web3 enabled", isWeb3Enabled)
    const {
        data,
        error,
        runContractFunction: getTokenURI,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { tokenId: tokenId },
    })

    const cardClickHandler = () => {
        if ((account = owner || owner == undefined)) {
            console.log("show modal set to true")
            setShowModal(true)
        } else {
            console.log("Buy NFT Modal - TBD")
        }
    }
    const updateUI = async () => {
        const tokenUri = await getTokenURI()
        console.log(tokenUri)
        if (tokenUri) {
            const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestUrl)).json()
            const image = tokenURIResponse.image
            if (image) {
                const imageUrl = image.replace("ipfs://", "http://ipfs.io/ipfs/")
                setImgUrl(imageUrl)
            }
            setTitle(tokenURIResponse.name)
            setDescription(tokenURIResponse.description)
        }

        console.log("output", tokenUri)
    }

    const nftCard = () => {
        const ownedBy =
            account == owner || owner == undefined ? "you" : showAddress(owner, 15, "...")
        return (
            <div
                style={{
                    width: "500px",
                }}
            >
                <UpdateNFTModal isVisible={showModal} onClose={hideUpdateModal} />
                <Card title={title} description={description} onClick={cardClickHandler}>
                    <div>#{tokenId}</div>
                    <div className="italic text-sm">Owned by {ownedBy}</div>
                    <div>
                        <Image loader={() => imgUrl} src={imgUrl} height="200" width="200" />
                    </div>
                    <div className="font-bold">{ethers.utils.formatEther(price)} ETH</div>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        console.log("calling update ui")
        isWeb3Enabled && updateUI()
    }, [isWeb3Enabled])

    return <div>{imgUrl ? nftCard() : <div>Loading image...</div>}</div>
}
