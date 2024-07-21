import React from "react";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import Identicon from "./Identicon";
import ConnectButton from "./ConnectButton";
import { ethers } from "ethers";

const Navbar: React.FC<{ account: string | null; setAccount: React.Dispatch<React.SetStateAction<string | null>> }> = ({ account, setAccount }) => {
  const [showSidebar, setShowSidebar] = React.useState<boolean>(false);

  const handleConnect = async () => {
    if (account) {
      setShowSidebar(true);
    }
  };

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

  return (
    <>
      <Flex direction="row" align="center" justify="space-between" p={4} bg="gray.800" color="white">
        <Flex align="center">
          <Box mr={4}>
            <Link as={RouterLink} to="/" color="white" fontSize="lg" fontWeight="bold">
              Home
            </Link>
          </Box>
          <Box mr={4}>
            <Link as={RouterLink} to="/swap" color="white" fontSize="lg" fontWeight="bold">
              Swap
            </Link>
          </Box>
          <Box>
            <Link as={RouterLink} to="/liquidity" color="white" fontSize="lg" fontWeight="bold">
              Liquidity
            </Link>
          </Box>
        </Flex>
        <Button
          onClick={() => setShowSidebar(prev => !prev)}
          bg="gray.700"
          color="white"
          _hover={{ bg: "gray.600" }}
          mr={4}
        >
          {showSidebar ? "Close Sidebar" : "Open Sidebar"}
        </Button>
      </Flex>
      {showSidebar && (
        <Box
          position="fixed"
          top="0"
          right="0"
          width="350px" // Increased width of the sidebar
          height="100%"
          bg="gray.900"
          color="white"
          p={4}
          zIndex="overlay"
          boxShadow="md" // Optional: adds shadow for better visibility
        >
          <Flex direction="column" height="100%">
            <Box mb={4}>
              {account ? (
                <Box
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.700"
                  p={4}
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
              ) : (
                <Flex direction="column" align="center" justify="center" height="100%">
                  <ConnectButton account={account} setAccount={setAccount} onConnect={handleConnect} />
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Navbar;
