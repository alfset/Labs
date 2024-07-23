import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface StakeProps {
  account: string | null;
}

const Stake: React.FC<StakeProps> = ({ account }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">Stake Page</Text>
      <Text mt={2}>Welcome to the Stake page!</Text>
      {account && <Text mt={2}>Connected Account: {account}</Text>}
    </Box>
  );
};

export default Stake;
