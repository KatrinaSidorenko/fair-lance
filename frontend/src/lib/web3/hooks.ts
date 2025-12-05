import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { ESCROW_ABI, ESCROW_CONTRACT_ADDRESS } from "./contract";
import { useCallback, useEffect, useState } from "react";

// Type for blockchain job details
export interface BlockchainJobDetails {
  employer: `0x${string}`;
  freelancer: `0x${string}`;
  amount: bigint;
  funded: boolean;
  approved: boolean;
  completed: boolean;
}

// Hook to publish a job with escrow
export function usePublishJob() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const [localError, setLocalError] = useState<Error | null>(null);

  const publishJob = useCallback(async (jobId: number, amount: string) => {
    try {
      setLocalError(null);
      writeContract({
        address: ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "publishJob",
        args: [BigInt(jobId)],
        value: parseEther(amount),
      });
    } catch (e) {
      setLocalError(e instanceof Error ? e : new Error("Failed to publish job"));
    }
  }, [writeContract]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Reset state when starting new transaction
  const resetState = useCallback(() => {
    reset();
    setLocalError(null);
  }, [reset]);

  return {
    publishJob,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || localError,
    reset: resetState,
  };
}

// Hook to assign a freelancer to a job
export function useAssignFreelancer() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const [localError, setLocalError] = useState<Error | null>(null);

  const assignFreelancer = useCallback((
    jobId: number,
    freelancerAddress: `0x${string}`,
  ) => {
    try {
      setLocalError(null);
      writeContract({
        address: ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "assignExecutor",
        args: [BigInt(jobId), freelancerAddress],
      });
    } catch (e) {
      setLocalError(e instanceof Error ? e : new Error("Failed to assign freelancer"));
    }
  }, [writeContract]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const resetState = useCallback(() => {
    reset();
    setLocalError(null);
  }, [reset]);

  return {
    assignFreelancer,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || localError,
    reset: resetState,
  };
}

// Hook to approve a completed job
export function useApproveJob() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const [localError, setLocalError] = useState<Error | null>(null);

  const approveJob = useCallback((jobId: number) => {
    try {
      setLocalError(null);
      writeContract({
        address: ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "approveJob",
        args: [BigInt(jobId)],
      });
    } catch (e) {
      setLocalError(e instanceof Error ? e : new Error("Failed to approve job"));
    }
  }, [writeContract]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const resetState = useCallback(() => {
    reset();
    setLocalError(null);
  }, [reset]);

  return {
    approveJob,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || localError,
    reset: resetState,
  };
}

// Hook to withdraw payment as freelancer
export function useWithdraw() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const [localError, setLocalError] = useState<Error | null>(null);

  const withdraw = useCallback((jobId: number) => {
    try {
      setLocalError(null);
      writeContract({
        address: ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "withdraw",
        args: [BigInt(jobId)],
      });
    } catch (e) {
      setLocalError(e instanceof Error ? e : new Error("Failed to withdraw"));
    }
  }, [writeContract]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const resetState = useCallback(() => {
    reset();
    setLocalError(null);
  }, [reset]);

  return {
    withdraw,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: error || localError,
    reset: resetState,
  };
}

// Hook to get job details from blockchain
export function useGetJobDetails(jobId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ESCROW_CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: "jobs",
    args: jobId !== undefined ? [BigInt(jobId)] : undefined,
    query: {
      enabled: jobId !== undefined,
    },
  });

  const jobDetails: BlockchainJobDetails | null = data
    ? {
        employer: data[0],
        freelancer: data[1],
        amount: data[2],
        funded: data[3],
        approved: data[4],
        completed: data[5],
      }
    : null;

  return {
    jobDetails,
    formattedAmount: jobDetails ? formatEther(jobDetails.amount) : "0",
    isLoading,
    error,
    refetch,
  };
}

// Hook to get pending withdrawal amount for a job
export function useGetPendingWithdrawal(jobId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: ESCROW_CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: "pendingWithdrawals",
    args: jobId !== undefined ? [BigInt(jobId)] : undefined,
    query: {
      enabled: jobId !== undefined,
    },
  });

  return {
    pendingAmount: data ?? BigInt(0),
    formattedAmount: data ? formatEther(data) : "0",
    isLoading,
    error,
    refetch,
  };
}
