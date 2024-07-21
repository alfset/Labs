import React from "react";
import { Box, Heading, Text, Button, Stack, Center } from "@chakra-ui/react";

const HeroSection: React.FC = () => {
  return (
    <Box bg="teal.600" color="white" py={20} px={6} textAlign="center">
      <Heading as="h1" size="2xl" mb={4}>Welcome to DeFiSwap</Heading>
      <Text fontSize="xl" mb={8}>Your go-to platform for DeFi trading and liquidity provision.</Text>
      <Stack spacing={4} align="center">
        <Button size="lg" colorScheme="teal">Get Started</Button>
        <Button size="lg" variant="outline" borderColor="teal.500" color="teal.500">Learn More</Button>
      </Stack>
    </Box>
  );
};

export default HeroSection;
