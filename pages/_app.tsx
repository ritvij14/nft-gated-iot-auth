import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

/**
connect wallet
check for NFT ownership
cross check device MAC address with NFT metadata
print editions for multiple ownerships
signature for various actions

FROM CARDINAL
Invalidation of a particular NFT
time based NFTs that get invalidated once a time period is over
 */
