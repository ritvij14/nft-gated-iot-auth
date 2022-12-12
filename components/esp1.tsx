import { Button, Flex } from "@chakra-ui/react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import React, { useState } from "react";
import { wallet } from "../utils/constants";
import getProvider from "../utils/getProvider";
import {
  connection,
  createNft,
  createTokenManager,
  invalidateAndReturnNft,
  MAC2,
} from "../utils/mintEdition";

const ESP1 = () => {
  const [bulb, setBulb] = useState("off");
  const provider = getProvider();

  return (
    <>
      <Button
        onClick={async () => {
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
              console.log("Found: ", found);
              const res = await axios.get(found.data.uri);
              const mac = res.data.attributes[0].value;
              if (mac == MAC2) {
                if (bulb == "on") {
                  await axios.get("http://172.20.10.2/23/off");
                  setBulb("off");
                } else {
                  await axios.get("http://172.20.10.2/23/on");
                  setBulb("on");
                }
              } else {
                console.log("unauthorised");
              }
            } else {
              console.log("not found, unauthorised");
            }
          }
        }}
      >
        Turn {`${bulb == "on" ? "off" : "on"}`} LED on device 2
      </Button>
      <Flex my="8%" flexDirection="row">
        <Button
          mr="2%"
          onClick={() => {
            createTokenManager(
              new PublicKey("8gt1A95Ge7nyX4SQQjSq8wU8ZQrdsuxVcYaPQgCRvuy4")
            );
          }}
        >
          Create Token Manager
        </Button>
        <Button
          onClick={() => {
            createNft();
          }}
        >
          Mint NFT
        </Button>
      </Flex>
      <Button
        onClick={() => {
          invalidateAndReturnNft(
            new PublicKey("8gt1A95Ge7nyX4SQQjSq8wU8ZQrdsuxVcYaPQgCRvuy4")
          );
        }}
      >
        Invalidate NFT
      </Button>
    </>
  );
};

export default ESP1;
