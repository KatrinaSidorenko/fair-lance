Step-by-Step Guide

1. Prerequisites
   Make sure you have:
   MetaMask browser extension installed 1
   Local blockchain running (Ganache or Hardhat) on http://127.0.0.1:8545
   Frontend running (usually on http://localhost:3000)
2. Set Up MetaMask for Local Development
   Open MetaMask and click on the network dropdown (top center)
   Add a custom network with these settings:
   | Setting | Value |
   |---------|-------|
   | Network Name | Ganache Local or Hardhat Local |
   | RPC URL | http://127.0.0.1:8545 |
   | Chain ID | 1337 (Ganache) or 31337 (Hardhat) |
   | Currency Symbol | ETH |
   Import a test account from your local blockchain:
   Copy a private key from Ganache/Hardhat output
   In MetaMask: Click account icon → "Import Account" → Paste private key
3. Connect on the UI
   Go to the FairLance frontend (e.g., http://localhost:3000)
   Click the "Connect Wallet" button in the top navigation bar
   MetaMask will popup asking you to:
   Select which account(s) to connect
   Confirm the connection
   Once connected, the button will show:
   Your address (e.g., 0x1234...5678)
   A green indicator showing you're connected
4. If You See "Wrong Network"
   If you're on a different network, the button will show "Wrong Network" in red. Click it and select:
   Ganache Local (1337) - if using Ganache
   Hardhat Local (31337) - if using Hardhat
   The network will be automatically added to MetaMask if it's not there yet.
5. Wallet Dropdown Features
   Once connected, click your address to access:
   Balance - Your ETH balance with refresh button
   Current Network - Shows which chain you're on
   Copy Address - Copy your full address
   Switch Network - Change between supported networks
   Disconnect - Disconnect your wallet
