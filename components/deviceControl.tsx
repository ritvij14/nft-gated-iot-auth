import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import getProvider from "../utils/getProvider";
import ESP0 from "./esp0";
import ESP1 from "./esp1";

enum Device {
  none,
  esp0,
  esp1,
  raspi,
}

const DeviceControlSection = () => {
  const [device, setDevice] = useState(Device.none);
  const provider = getProvider();

  return (
    <Box mx="15rem">
      <Flex my="8%" flexDirection="row">
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
          Connect to wallet
        </Button>
      </Flex>
      <Text>Choose the device</Text>
      <Flex my="5%" gap="5">
        <Button
          onClick={() => {
            setDevice(Device.esp0);
          }}
        >
          ESP #1
        </Button>
        <Button
          onClick={() => {
            setDevice(Device.esp1);
          }}
        >
          ESP #2
        </Button>
        <Button
          onClick={() => {
            setDevice(Device.raspi);
          }}
        >
          Raspberry Pi 4
        </Button>
      </Flex>
      {device == Device.esp0 && <ESP0 />}
      {device == Device.esp1 && <ESP1 />}
    </Box>
  );
};

export default DeviceControlSection;
