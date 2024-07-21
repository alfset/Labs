import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface SwapProps {
  account: string | null;
}

const Swap: React.FC<SwapProps> = ({ account }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">Swap Page</Text>
      <Text mt={2}>Here you can perform swaps.</Text>
      {account && <Text mt={2}>Connected Account: {account}</Text>}
    </Box>
  );
};

export default Swap;
