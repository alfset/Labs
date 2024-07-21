import React from "react";
import { Box, Flex, Heading, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { MdSwapHoriz, MdAddCircleOutline, MdPieChart } from "react-icons/md";

// Define the features
const features = [
  { icon: MdSwapHoriz, title: "Token Swap", description: "Seamless token swapping with low fees." },
  { icon: MdAddCircleOutline, title: "Liquidity Pools", description: "Provide liquidity and earn rewards." },
  { icon: MdPieChart, title: "Yield Farming", description: "Boost returns with yield farming opportunities." },
];

const FeaturesSection: React.FC = () => {
  return (
    <Box py={16} px={8} className="glassy-background">
      <Heading as="h2" textAlign="center" mb={8}>Features</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {features.map((feature) => (
          <Box key={feature.title} textAlign="center" p={6} bg="white" borderRadius="md" boxShadow="md">
            <Icon as={feature.icon} w={10} h={10} mb={4} color="teal.500" />
            <Heading as="h3" fontSize="xl" mb={2}>{feature.title}</Heading>
            <Text>{feature.description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FeaturesSection;
