import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface PoolProps {
  account: string | null;
}

const Pool: React.FC<PoolProps> = ({ account }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">Pool Page</Text>
      <Text mt={2}>Welcome to the Pool page!</Text>
      {account && <Text mt={2}>Connected Account: {account}</Text>}
    </Box>
  );
};

export default Pool;
