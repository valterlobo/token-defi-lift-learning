const { expect } = require('chai');
const { ethers } = require("hardhat");
const { it } = require("mocha");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe('Token WolftTokenTx', () => {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshopt in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const Token = await ethers.getContractFactory('WolftTokenTx');
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // mint tokens
    const balance = await hardhatToken.balanceOf(owner.address);
    console.log(balance);
    // await hardhatToken.mint(owner,1000);

    // Fixtures can return anything you consider useful for your tests
    return {
      Token, hardhatToken, owner, addr1, addr2,
    };
  }

  // You can nest describe calls to create subsections.
  describe('Deployment', () => {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it('Should set the right owner', async () => {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    it('Should assign the total supply of tokens to the owner', async () => {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Transactions', () => {
    it('Should transfer tokens between accounts', async () => {
      const {
        hardhatToken, owner, addr1, addr2,
      } = await loadFixture(
        deployTokenFixture,
      );
      // Transfer 50 tokens from owner to addr1
      const vlTransfer = ethers.utils.parseEther('50');
      const minusVlTransfer = vlTransfer.mul(-1);
      const tax = await hardhatToken.calcTax(vlTransfer);
      const newVlTransfer = ethers.BigNumber.from(vlTransfer).sub(tax);
      console.log('-----------------------');
      console.log(vlTransfer);
      console.log(minusVlTransfer);
      console.log(newVlTransfer);
      console.log(tax);
      console.log('-----------------------');

      await expect(
        hardhatToken.transfer(addr1.address, vlTransfer),
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [minusVlTransfer, newVlTransfer]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      const newTax = await hardhatToken.calcTax(newVlTransfer);
      const newVl = ethers.BigNumber.from(newVlTransfer).sub(newTax);

      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, newVlTransfer),
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [newVlTransfer.mul(-1), newVl]);
    });

    it('should emit Transfer events', async () => {
      const {
        hardhatToken, owner, addr1, addr2,
      } = await loadFixture(
        deployTokenFixture,
      );

      // Transfer 50 tokens from owner to addr1
      const vlTransfer = ethers.utils.parseEther('50');
      const tax = await hardhatToken.calcTax(vlTransfer);
      const newVlTransfer = vlTransfer.sub(tax);
      await expect(hardhatToken.transfer(addr1.address, vlTransfer))
        .to.emit(hardhatToken, 'Transfer')
        .withArgs(owner.address, addr1.address, newVlTransfer);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      const newTax = await hardhatToken.calcTax(newVlTransfer);
      const newVl = ethers.BigNumber.from(newVlTransfer).sub(newTax);
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, newVlTransfer))
        .to.emit(hardhatToken, 'Transfer')
        .withArgs(addr1.address, addr2.address, newVl);
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture,
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      // await hardhatToken.connect(addr1).transfer(owner.address, 1);

      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, ethers.utils.parseEther('1')),
      ).to.be.revertedWith('ERC20: burn amount exceeds balance');

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance,
      );
    });
  });
});
