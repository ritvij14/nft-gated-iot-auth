import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import getProvider from "../utils/getProvider";

const DeviceControlSection = () => {
  const [bulb, setBulb] = useState("off");
  const provider = getProvider();

  return (
    <Box>
      <Flex mx="15rem" my="8%" flexDirection="row">
        <Button
          onClick={async () => {
            if (provider != undefined) {
              try {
                const resp = await provider.connect();
                console.log(resp.publicKey.toString());
              } catch (err) {
                console.log("User rejected request");
              }
            }
          }}
        >
          Connect to device 1
        </Button>
      </Flex>
      <Flex mx="15rem" my="8%" flexDirection="row">
        <Button
          onClick={async () => {
            if (bulb == "on") {
              await fetch("http://172.20.10.13/off");
              setBulb("off");
            } else {
              await fetch("http://172.20.10.13/on");
              setBulb("on");
            }
          }}
        >
          Turn {`${bulb == "on" ? "off" : "on"}`} LED on device 1
        </Button>
      </Flex>
    </Box>
  );
};

export default DeviceControlSection;
