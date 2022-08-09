const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');

describe('WolfSwap', () => {
  async function deploySwapTokenFixture() {
    // Get the ContractFactory and Signers here.
    const Token = await ethers.getContractFactory('WolftToken');
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    const WolfSwap = await ethers.getContractFactory('WolfSwap');
    const wolfSwap = await WolfSwap.deploy(hardhatToken.address);

    // Fixtures can return anything you consider useful for your tests
    return {
      WolfSwap, wolfSwap, Token, hardhatToken, owner, addr1, addr2,
    };
  }

  describe('Deployment', () => {
    it('Should set the right deploy', async () => {
      const {
        WolfSwap, wolfSwap, Token, hardhatToken, owner, addr1, addr2,
      } = await loadFixture(deploySwapTokenFixture);

      expect(await wolfSwap.connect(owner).GetBalance()).to.equal(0);
      expect(await wolfSwap.WolfTokenBalance()).to.equal(0);
    });
  });

  describe('Transactions', () => {
    it('Should transfer tokens between accounts and BuyWolfToken', async () => {
      const {
        WolfSwap, wolfSwap, Token, hardhatToken, owner, addr1, addr2,
      } = await loadFixture(
        deploySwapTokenFixture,
      );
      // Transfer 500 tokens from owner to contract swap
      const tokenAmount = ethers.utils.parseEther('500');
      await expect(
        hardhatToken.transfer(wolfSwap.address, tokenAmount),
      ).to.changeTokenBalances(hardhatToken, [owner, wolfSwap.address], [tokenAmount.mul(-1), tokenAmount]);

      await wolfSwap.connect(addr1).BuyWolfToken({
        value: ethers.utils.parseEther('4'),
      });

      // addr1 balance  have changed. 1 MATIC TO 10 WOLFTOKEN
      const addr1WolfTokenBalance = ethers.utils.parseEther('40');
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(
        addr1WolfTokenBalance,
      );
    });

    it('Should WithdrawBalance MANTIC', async () => {
      const {
        WolfSwap, wolfSwap, Token, hardhatToken, owner, addr1, addr2,
      } = await loadFixture(
        deploySwapTokenFixture,
      );
      // Transfer 500 tokens from owner to contract swap
      const tokenAmount = ethers.utils.parseEther('500');
      await expect(
        hardhatToken.transfer(wolfSwap.address, tokenAmount),
      ).to.changeTokenBalances(hardhatToken, [owner, wolfSwap.address], [tokenAmount.mul(-1), tokenAmount]);

      await wolfSwap.connect(addr1).BuyWolfToken({
        value: ethers.utils.parseEther('4'),
      });

      // wolfSwap balance  have changed. 4 MATIC 
      const wolfSwapBalance = ethers.utils.parseEther('4');
      expect(await wolfSwap.connect(owner).GetBalance()).to.equal(
        wolfSwapBalance,
      );
    });
  });
});
