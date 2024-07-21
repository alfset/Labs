// src/index.tsx

import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider, Config } from "@usedapp/core";
import App from "./App";

const config: Config = {};

ReactDOM.render(
  <ChakraProvider>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
