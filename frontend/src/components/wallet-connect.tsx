"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";
import {
  ganache,
  localHardhat,
  switchToLocalNetwork,
  supportedChains,
} from "@/lib/web3/config";

export function WalletConnect() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
  });

  const [copied, setCopied] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMetaMaskInstalled(!!window.ethereum?.isMetaMask);
    }
  }, []);

  // Check if on supported chain
  const isOnSupportedChain = supportedChains.some((c) => c.id === chainId);
  const currentChain = supportedChains.find((c) => c.id === chainId);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      connect({ connector: injected({ target: "metaMask" }) });
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleSwitchNetwork = async (targetChainId: number) => {
    setIsSwitchingNetwork(true);
    try {
      // Try wagmi switch first
      switchChain?.({ chainId: targetChainId as 1337 | 31337 });
    } catch {
      // Fallback to manual switch
      try {
        await switchToLocalNetwork(targetChainId);
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: typeof balance) => {
    if (!bal) return "0.00";
    // Convert from wei to ETH (18 decimals)
    const value = Number(bal.value) / Math.pow(10, bal.decimals);
    return value.toFixed(4);
  };

  // Not connected state
  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isPending || isConnecting}
        className="gap-2"
      >
        {isPending || isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : !isMetaMaskInstalled ? (
          <>
            <Wallet className="h-4 w-4" />
            Install MetaMask
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // Wrong network warning
  if (!isOnSupportedChain) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Wrong Network
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-destructive">
            Switch to a supported network
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSwitchNetwork(ganache.id)}
            disabled={isSwitchingNetwork}
          >
            {isSwitchingNetwork ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Ganache Local (1337)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSwitchNetwork(localHardhat.id)}
            disabled={isSwitchingNetwork}
          >
            {isSwitchingNetwork ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Hardhat Local (31337)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Connected state with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-mono">{formatAddress(address!)}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground font-mono">
              {formatAddress(address!)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Balance */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Balance</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => refetchBalance()}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-lg font-bold">
            {formatBalance(balance)} {balance?.symbol || "ETH"}
          </p>
        </div>
        <DropdownMenuSeparator />

        {/* Network */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Network</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium">{currentChain?.name}</span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem onClick={handleCopyAddress}>
          {copied ? (
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Switch Network */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Network
        </DropdownMenuLabel>
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleSwitchNetwork(chain.id)}
            disabled={chain.id === chainId || isSwitchingNetwork}
          >
            <div className="flex items-center gap-2">
              {chain.id === chainId && (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
              <span className={chain.id === chainId ? "font-medium" : ""}>
                {chain.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => disconnect()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
