import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

const DeviceControlSection = () => {
  return (
    <Box>
      <Flex mx="15rem" my="8%" flexDirection="row">
        <Button>Connect to device 1</Button>
      </Flex>
      <Flex mx="15rem" my="8%" flexDirection="row">
        <Button>Light LED on device 1</Button>
      </Flex>
    </Box>
  );
};

export default DeviceControlSection;
