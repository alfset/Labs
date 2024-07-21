import React from "react";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import Identicon from "./Identicon";
import { ethers } from "ethers";

type AccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
};

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, account, setAccount }) => {
  const handleChangeAccount = async () => {
    setAccount(null);
    try {
      if ((window as any).ethereum) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        console.error("No Ethereum provider detected");
      }
    } catch (err) {
      console.error("Failed to request accounts:", err);
    }
  };

  if (!isOpen) return null; // Render nothing if not open

  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="90%"
      maxWidth="400px"
      background="gray.900"
      border="1px"
      borderColor="gray.700"
      borderRadius="md"
      boxShadow="lg"
      p={4}
      zIndex="overlay"
    >
      <Flex direction="column" height="100%">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text color="white" fontSize="lg" fontWeight="bold">
            Account
          </Text>
          <Button
            variant="link"
            color="white"
            onClick={onClose}
            _hover={{ textDecoration: "none", color: "gray.400" }}
          >
            Close
          </Button>
        </Flex>

        <Box
          borderRadius="md"
          border="1px"
          borderColor="gray.600"
          p={4}
          mb={4}
          background="gray.800"
        >
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Text color="gray.400" fontSize="sm">
              Connected with MetaMask
            </Text>
            <Button
              variant="outline"
              size="sm"
              borderColor="blue.800"
              borderRadius="md"
              color="blue.500"
              fontSize="13px"
              fontWeight="normal"
              px={2}
              height="26px"
              _hover={{
                background: "none",
                borderColor: "blue.300",
                textDecoration: "underline",
              }}
              onClick={handleChangeAccount}
            >
              Change
            </Button>
          </Flex>

          <Flex alignItems="center" mb={4}>
            <Identicon account={account || ""} />
            <Text
              color="white"
              fontSize="xl"
              fontWeight="semibold"
              ml="2"
              lineHeight="1.1"
            >
              {account &&
                `${account.slice(0, 6)}...${account.slice(
                  account.length - 4,
                  account.length
                )}`}
            </Text>
          </Flex>

          <Flex alignContent="center" mb={4}>
            <Button
              variant="link"
              color="gray.400"
              fontWeight="normal"
              fontSize="sm"
              _hover={{
                textDecoration: "none",
                color: "whiteAlpha.800",
              }}
              onClick={() => navigator.clipboard.writeText(account || "")}
            >
              <CopyIcon mr={1} />
              Copy Address
            </Button>
            <Link
              fontSize="sm"
              display="flex"
              alignItems="center"
              href={`https://etherscan.io/address/${account}`}
              isExternal
              color="gray.400"
              ml={6}
              _hover={{
                color: "whiteAlpha.800",
                textDecoration: "underline",
              }}
            >
              <ExternalLinkIcon mr={1} />
              View on Explorer
            </Link>
          </Flex>
        </Box>

        <Text
          color="white"
          textAlign="left"
          fontWeight="medium"
          fontSize="md"
          mt="auto"
        >
          Your transactions will appear here...
        </Text>
      </Flex>
    </Box>
  );
};

export default AccountModal;
