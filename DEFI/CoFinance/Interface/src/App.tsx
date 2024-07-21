import React from "react";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Swap from "./Pages/Swap";
import Liquidity from "Pages/Liquidity";

const App: React.FC = () => {
  const [account, setAccount] = React.useState<string | null>(null);

  return (
    <ChakraProvider>
      <Router>
        <Flex direction="column" height="100vh">
          <Navbar account={account} setAccount={setAccount} />
          <Box flex="1" p={4}>
            <Routes>
              <Route path="/" element={<Home account={account} />} />
              <Route path="/swap" element={<Swap account={account} />} />
              <Route path="/liquidity" element={<Liquidity account={account} />} />
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  );
};

export default App;
