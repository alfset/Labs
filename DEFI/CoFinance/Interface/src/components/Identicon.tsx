// src/components/Identicon.tsx

import React, { useEffect, useRef } from "react";
import { utils } from "ethers";

type IdenticonProps = {
  account: string;
};

const Identicon: React.FC<IdenticonProps> = ({ account }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account && ref.current) {
      const icon = utils.keccak256(utils.toUtf8Bytes(account)).substring(2, 10);
      ref.current.style.background = `#${icon}`;
    }
  }, [account]);

  return <div ref={ref} style={{ width: 40, height: 40, borderRadius: "50%" }} />;
};

export default Identicon;
