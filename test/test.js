const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  let amount = ethers.utils.parseEther('1');
  let newAmount = ethers.utils.parseEther('5');
  // const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);
    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      amount,
      {
        value: amount,
      }
    );
    await contract.deployed();
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(amount);
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
      await expect(contract.connect(depositor).approve()).to.be.reverted;
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(amount);
    });
  });

  describe('after funds sent to depositor, can change amount now and approve for beneficiary', () => {
    it('should let the depositor change the depsosit amount', async () => {
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();

      const newDepositAmountTxn = await contract.connect(depositor).newDepositAmount(newAmount, {value: newAmount});
      await newDepositAmountTxn.wait();

      const newContractBalance = await ethers.provider.getBalance(contract.address);
      expect(newContractBalance).to.eq(newAmount);
      // console.log(newContractBalance);
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn2 = await contract.connect(arbiter).approve();
      await approveTxn2.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before).add(amount)).to.eq(newAmount.add(amount));
    })
  })

});

