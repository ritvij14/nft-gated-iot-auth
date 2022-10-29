import { useColorMode, IconButton } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      marginX="1rem"
      aria-label="color mode toggle"
      icon={colorMode === "dark" ? <MdLightMode /> : <MdDarkMode />}
      onClick={toggleColorMode}
    />
  );
};

export default ColorModeToggle;
