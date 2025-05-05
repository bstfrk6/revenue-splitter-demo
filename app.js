const splitBtn = document.getElementById('splitBtn');
const output   = document.getElementById('output');

splitBtn.onclick = async () => {
  if (!window.ethereum) return alert('Please install MetaMask');

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();

  const contractAddress = document.getElementById('contractAddress').value.trim();
  const payee1          = document.getElementById('payee1').value.trim();
  const payee2          = document.getElementById('payee2').value.trim();
  const amountEth       = document.getElementById('amount').value.trim();

  if (
    !ethers.utils.isAddress(contractAddress) ||
    !ethers.utils.isAddress(payee1) ||
    !ethers.utils.isAddress(payee2)
  ) {
    return alert('One or more addresses are invalid.');
  }

  const value = ethers.utils.parseEther(amountEth);
  output.textContent = `↗ Sending ${amountEth} ETH to ${contractAddress}…`;

  try {
    const tx = await signer.sendTransaction({ to: contractAddress, value });
    output.textContent += `\n↗ Tx sent: ${tx.hash}\n⏳ Waiting for confirmation…`;

    const receipt = await tx.wait();
    output.textContent += `\n✅ Confirmed in block ${receipt.blockNumber}`;

    const bal1 = await provider.getBalance(payee1);
    const bal2 = await provider.getBalance(payee2);
    output.textContent +=
      `\n\n📊 New balances:` +
      `\n• ${payee1}: ${ethers.utils.formatEther(bal1)} ETH` +
      `\n• ${payee2}: ${ethers.utils.formatEther(bal2)} ETH`;
  } catch (err) {
    output.textContent += `\n❌ Error: ${err.message}`;
  }
};
