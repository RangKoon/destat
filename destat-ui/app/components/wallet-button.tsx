import { Button } from "@base-ui/react/button";
import { useAccount, useDisconnect } from "wagmi";
import { rabbykit } from "~/root";
export default function WalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <div>
      {isConnected ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <Button onClick={() => rabbykit.open()}>Connect</Button>
      )}
    </div>
  );
}
