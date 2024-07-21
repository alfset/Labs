import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface LiquidityProps {
  account: string | null;
}

const Liquidity: React.FC<LiquidityProps> = ({ account }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">Home Page</Text>
      <Text mt={2}>Welcome to the Home page!</Text>
      {account && <Text mt={2}>Connected Account: {account}</Text>}
    </Box>
  );
};

export default Liquidity;
