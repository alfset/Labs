import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface AddProps {
  account: string | null;
}

const Add: React.FC<AddProps> = ({ account }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">Add Page</Text>
      <Text mt={2}>Welcome to the Add page!</Text>
      {account && <Text mt={2}>Connected Account: {account}</Text>}
    </Box>
  );
};

export default Add;
