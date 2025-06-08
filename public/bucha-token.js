const connectButton = document.getElementById('connectButton');
const balanceEl = document.getElementById('balance');
const transferForm = document.getElementById('transferForm');
const tokenAddress = '0xYourTokenAddress'; // ใส่ที่อยู่สัญญาที่ปรับใช้แล้ว

const tokenAbi = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address,uint256) returns (bool)',
  'function decimals() view returns(uint8)'
];

let provider;
let signer;
let token;
let decimals = 18;

connectButton.addEventListener('click', async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    token = new ethers.Contract(tokenAddress, tokenAbi, signer);
    decimals = await token.decimals();
    const addr = await signer.getAddress();
    const bal = await token.balanceOf(addr);
    balanceEl.textContent = `ยอดคงเหลือ: ${ethers.formatUnits(bal, decimals)} BUCHA`;
  } else {
    alert('MetaMask not found');
  }
});

transferForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!token) return;
  const to = document.getElementById('recipient').value;
  const amt = ethers.parseUnits(document.getElementById('amount').value, decimals);
  try {
    const tx = await token.transfer(to, amt);
    await tx.wait();
    alert('Transfer success');
  } catch (err) {
    console.error(err);
    alert('Transfer failed');
  }
});
