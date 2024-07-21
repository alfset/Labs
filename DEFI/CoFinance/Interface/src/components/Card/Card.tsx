import React from 'react';
import { Box, Image, Text, Flex } from '@chakra-ui/react';

interface CardProps {
  title: string;
  imageUrl: string;
  width?: string;
  bgColor?: string;
  padding?: string;
  component?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  width = 'w-96', // Default width class
  bgColor = 'white', // Default background color
  padding = 'p-5', // Default padding
  component,
}) => {
  return (
    <Box
      position="relative"
      width={width}
      bg={bgColor}
      borderRadius="xl" // Rounded corners
      overflow="hidden"
      boxShadow="md"
      cursor="pointer"
      _hover={{ transform: 'scale(1.02)' }}
      transition="transform 0.3s ease"
    >
      <Image
        src={imageUrl}
        alt=""
        objectFit="cover"
        width="100%"
        height={{ base: '300px', md: '200px' }} // Responsive height
        borderRadius="xl"
      />
      <Box
        position="absolute"
        inset="0"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        p={{ base: 5, md: 10 }}
        textAlign="center"
        color="white"
      >
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          w="full"
          mb={6}
        >
          <Text
            fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
            fontWeight="bold"
            textAlign={{ base: 'center', md: 'left' }}
            maxW={{ base: 'full', md: 'lg' }}
            mb={{ base: 4, md: 0 }}
          >
            {title}
          </Text>
          {component && (
            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems="center"
              justifyContent="center"
              maxW={{ base: 'full', md: '4xl' }}
            >
              {component}
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Card;
