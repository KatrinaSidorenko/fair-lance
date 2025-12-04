// src/main.ts
import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "./contract";

const connectBtn = document.getElementById("connect") as HTMLButtonElement;
const createBtn = document.getElementById("create") as HTMLButtonElement;
const fundBtn = document.getElementById("fund") as HTMLButtonElement;
const assignBtn = document.getElementById("assign") as HTMLButtonElement;
const approveBtn = document.getElementById("approve") as HTMLButtonElement;
const withdrawBtn = document.getElementById("withdraw") as HTMLButtonElement;
const jobIdInput = document.getElementById("jobId") as HTMLInputElement;
const freelancerInput = document.getElementById("freelancer") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const status = document.getElementById("status") as HTMLDivElement;

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;
let account: string | null = null;

function log(s: string) {
  if (status) status.innerText = s;
  console.log(s);
}

function getProvider() {
  if (window.ethereum) return window.ethereum;
  return null;
}

// ---------------------------- CONNECT METAMASK ---------------------------- //
async function connect() {
  const eth = getProvider();
  if (!eth) {
    log("MetaMask not found. Please install MetaMask.");
    return;
  }

  const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
  account = accounts[0];

  provider = new ethers.BrowserProvider(eth);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const balance = await provider.getBalance(account);
  log(`✅ Connected as ${account}\nBalance: ${ethers.formatEther(balance)} ETH`);
}

// ---------------------------- CONTRACT FUNCTIONS ---------------------------- //
async function createJob() {
  if (!contract) return log("Connect first");
  const jobId = Number(jobIdInput.value);
  const tx = await contract.createJob(jobId);
  await tx.wait();
  log(`📄 Job ${jobId} created`);
}

async function fundJob() {
  if (!contract) return log("Connect first");
  const jobId = Number(jobIdInput.value);
  const amount = ethers.parseEther(amountInput.value);
  console.log("Funding job with amount:", amount.toString());
  const tx = await contract.publishJob(jobId, { value: amount });
  await tx.wait();
  log(`💰 Job ${jobId} funded with ${amountInput.value} ETH`);
}

async function assignFreelancer() {
  if (!contract) return log("Connect first");
  const jobId = Number(jobIdInput.value);
  const freelancer = freelancerInput.value;
  const tx = await contract.assignFreelancer(jobId, freelancer);
  await tx.wait();
  log(`👷 Freelancer assigned: ${freelancer}`);
}

async function approveJob() {
  if (!contract) return log("Connect first");
  const jobId = Number(jobIdInput.value);
  const tx = await contract.approveJob(jobId);
  await tx.wait();
  log(`✅ Job ${jobId} approved. Funds available to withdraw.`);
}

async function withdraw() {
  if (!contract) return log("Connect first");
  const tx = await contract.withdraw();
  await tx.wait();
  log(`💸 Funds withdrawn`);
}

// ---------------------------- BIND BUTTONS ---------------------------- //
connectBtn?.addEventListener("click", connect);
createBtn?.addEventListener("click", createJob);
fundBtn?.addEventListener("click", fundJob);
assignBtn?.addEventListener("click", assignFreelancer);
approveBtn?.addEventListener("click", approveJob);
withdrawBtn?.addEventListener("click", withdraw);
