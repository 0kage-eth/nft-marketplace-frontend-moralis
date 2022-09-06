import { MoralisProvider } from "react-moralis"
import Head from "next/head"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT MarketPlace</title>
                <meta name="description" content="A marketplace to buy/sell and list NFTs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider
                appId={process.env.NEXT_PUBLIC_APPID}
                serverUrl={process.env.NEXT_PUBLIC_DAPPURL}
            >
                <Component {...pageProps} />
            </MoralisProvider>
        </div>
    )
}

export default MyApp
