import { Flex, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import ColorModeToggle from "./themeToggle";

const Header = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      direction="row"
      w="100%"
      justify="space-between"
      alignItems="center"
      backgroundColor={colorMode == "light" ? "white" : "#1A202C"}
      px="6rem"
      py="2rem"
      boxShadow="lg"
    >
      <Text variant="unstyled" fontSize="2xl" fontWeight="medium">
        {"NFT Gated IoT Authentication"}
      </Text>

      <ColorModeToggle />
    </Flex>
  );
};

export default Header;
