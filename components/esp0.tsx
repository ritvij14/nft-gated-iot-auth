import React, { useEffect, useState } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import {
  connection,
  createNft,
  createTokenManager,
  invalidateAndReturnNft,
  mintEdition,
} from "../utils/mintEdition";
import { wallet, MAC1 } from "../utils/constants";
import axios from "axios";
import getProvider from "../utils/getProvider";
import { NftEdition } from "@metaplex-foundation/js";

const ESP0 = () => {
  const [bulb, setBulb] = useState("off");
  const provider = getProvider();
  const [editionMint, setEditionMint] = useState<NftEdition>();

  useEffect(() => {
    console.log(editionMint);
  }, [editionMint]);

  return (
    <>
      <Button
        onClick={async () => {
          const before = Date.now();
          if (provider != undefined) {
            const nfts = await getParsedNftAccountsByOwner({
              publicAddress: provider.publicKey?.toString()!,
              connection: connection,
            });
            const found = nfts.find((nft) =>
              nft.data.creators.find(
                (creator) => creator.address == wallet.publicKey
              )
            );
            if (found) {
              // console.log("Found: ", found);
              const res = await axios.get(found.data.uri);
              const mac = res.data.attributes[0].value;
              if (mac == MAC1) {
                if (bulb == "on") {
                  await axios.get("http://172.20.10.13/off");
                  setBulb("off");
                } else {
                  await axios.get("http://172.20.10.13/on");
                  setBulb("on");
                }
                const after = Date.now();
                console.log(after - before);
              } else {
                console.log("unauthorised");
              }
            } else {
              console.log("not found, unauthorised");
            }
          }
        }}
      >
        Turn {`${bulb == "on" ? "off" : "on"}`} LED on device 1
      </Button>
      <Flex my="8%" flexDirection="row">
        <Button
          onClick={async () => {
            const { edition } = await mintEdition(
              new PublicKey("8gt1A95Ge7nyX4SQQjSq8wU8ZQrdsuxVcYaPQgCRvuy4")
            );
            setEditionMint(edition);
          }}
        >
          Mint Edition
        </Button>
        <Button
          ml="2%"
          onClick={() => {
            if (editionMint != undefined) {
              createTokenManager(editionMint.address);
            } else {
              console.log("Edition not printed");
            }
          }}
        >
          Create Token Manager
        </Button>
      </Flex>
      <Button
        onClick={() => {
          if (editionMint != undefined) {
            invalidateAndReturnNft(editionMint.address);
          } else {
            console.log("Edition not printed");
          }
        }}
      >
        Invalidate NFT
      </Button>
    </>
  );
};

export default ESP0;
