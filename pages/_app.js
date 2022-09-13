import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import { Header } from "../components/Header"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT MarketPlacessss</title>
                <meta name="description" content="A marketplace to buy/sell and list NFTs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider
                appId={process.env.NEXT_PUBLIC_APPID}
                serverUrl={process.env.NEXT_PUBLIC_DAPPURL}
            >
                <Header />
                <Component {...pageProps} />
            </MoralisProvider>
        </div>
    )
}

export default MyApp
