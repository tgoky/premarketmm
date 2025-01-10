import { useState } from "react";
import { useTheme } from "next-themes";
import { useAccount, useSwitchChain } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { getNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps) => {
  const { switchChain } = useSwitchChain();
  const { resolvedTheme } = useTheme();
  const [loadingNetwork, setLoadingNetwork] = useState<number | null>(null); // Track loading state per network
  const isDarkMode = resolvedTheme === "dark";

  const handleSwitchChain = async (chainId: number) => {
    setLoadingNetwork(chainId);
    try {
      await switchChain?.({ chainId });
    } catch (error) {
      console.error("Failed to switch chains:", error);
      alert("Could not switch networks. Please try again.");
    } finally {
      setLoadingNetwork(null);
    }
  };

  if (hidden || allowedNetworks.length === 0) {
    return null;
  }

  return (
    <>
      {allowedNetworks.map(allowedNetwork => (
        <li key={allowedNetwork.id} className={hidden ? "hidden" : ""}>
          <button
            className={`menu-item btn-sm !rounded-xl flex gap-3 py-3 whitespace-nowrap ${
              loadingNetwork === allowedNetwork.id ? "opacity-50" : ""
            }`}
            type="button"
            disabled={loadingNetwork === allowedNetwork.id}
            onClick={() => handleSwitchChain(allowedNetwork.id)}
            aria-label={`Switch to ${allowedNetwork.name}`}
          >
            <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
            <span>
              {loadingNetwork === allowedNetwork.id ? "Switching..." : `Switch to `}
              <span
                style={{
                  color: getNetworkColor(allowedNetwork, isDarkMode),
                }}
              >
                {allowedNetwork.name}
              </span>
            </span>
          </button>
        </li>
      ))}
    </>
  );
};
