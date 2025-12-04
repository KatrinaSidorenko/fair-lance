import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "./contract";

// UI elements
const jobIdInput = document.getElementById("jobId") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const employerInput = document.getElementById("employerAddr") as HTMLInputElement;
const freelancerInput = document.getElementById("freelancerAddr") as HTMLInputElement;
const status = document.getElementById("status") as HTMLDivElement;

const fundBtn = document.getElementById("fund") as HTMLButtonElement;
const assignBtn = document.getElementById("assign") as HTMLButtonElement;
const approveBtn = document.getElementById("approve") as HTMLButtonElement;
const withdrawBtn = document.getElementById("withdraw") as HTMLButtonElement;

// ---------------------- LOCAL PROVIDER SETUP ---------------------- //
const RPC_URL = "http://127.0.0.1:8545"; // Ganache or Hardhat node
const provider = new ethers.JsonRpcProvider(RPC_URL);

let contract: ethers.Contract;

// ---------------------- INITIALIZE ---------------------- //
async function init() {
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  log(`✅ Connected to local blockchain at ${RPC_URL}`);
}

// ---------------------- CONTRACT INTERACTIONS ---------------------- //
async function publishJob() {
  const jobId = Number(jobIdInput.value);
  const amount = ethers.parseEther(amountInput.value);
  const employerAddr = employerInput.value;

  if (!ethers.isAddress(employerAddr)) {
    log("❌ Invalid employer address");
    return;
  }

  const signer = await provider.getSigner(employerAddr);
  const contractWithSigner = contract.connect(signer) as ethers.Contract;

  const tx = await contractWithSigner.publishJob(jobId, { value: amount });
  await tx.wait();
  log(`💰 Job ${jobId} funded with ${amountInput.value} ETH by ${employerAddr}`);
}

async function assignFreelancer() {
  const jobId = Number(jobIdInput.value);
  const employerAddr = employerInput.value;
  const freelancerAddr = freelancerInput.value;

  if (!ethers.isAddress(employerAddr) || !ethers.isAddress(freelancerAddr)) {
    log("❌ Invalid address(es)");
    return;
  }

  const signer = await provider.getSigner(employerAddr);
  const contractWithSigner = contract.connect(signer) as ethers.Contract;

  const tx = await contractWithSigner.assignExecutor(jobId, freelancerAddr);
  await tx.wait();
  log(`👷 Freelancer ${freelancerAddr} assigned to Job ${jobId}`);
}

async function approveJob() {
  const jobId = Number(jobIdInput.value);
  const employerAddr = employerInput.value;

  if (!ethers.isAddress(employerAddr)) {
    log("❌ Invalid employer address");
    return;
  }

  const signer = await provider.getSigner(employerAddr);
  const contractWithSigner = contract.connect(signer) as ethers.Contract;

  const tx = await contractWithSigner.approveJob(jobId);
  await tx.wait();
  log(`✅ Job ${jobId} approved by ${employerAddr}`);
}

async function withdraw() {
  const jobId = Number(jobIdInput.value);
  const freelancerAddr = freelancerInput.value;

  if (!ethers.isAddress(freelancerAddr)) {
    log("❌ Invalid freelancer address");
    return;
  }

  const signer = await provider.getSigner(freelancerAddr);
  const contractWithSigner = contract.connect(signer) as ethers.Contract;

  const tx = await contractWithSigner.withdraw(jobId)
  await tx.wait();
  log(`💸 Freelancer ${freelancerAddr} withdrew funds for Job ${jobId}`);
}

// ---------------------- UI BINDINGS ---------------------- //
fundBtn?.addEventListener("click", publishJob);
assignBtn?.addEventListener("click", assignFreelancer);
approveBtn?.addEventListener("click", approveJob);
withdrawBtn?.addEventListener("click", withdraw);

// ---------------------- LOG FUNCTION ---------------------- //
function log(msg: string) {
  if (status) status.innerText = msg;
  console.log(msg);
}

// ---------------------- START ---------------------- //
init().catch(console.error);
