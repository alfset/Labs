import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface LendingProps {
  account: string | null;
}

const Lending: React.FC<LendingProps> = ({ account }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">Home Page</Text>
      <Text mt={2}>Welcome to the Home page!</Text>
      {account && <Text mt={2}>Connected Account: {account}</Text>}
    </Box>
  );
};

export default Lending;
