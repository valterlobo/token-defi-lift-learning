const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");

  const { expect } = require("chai");
  
  describe("WolftToken", function () {
    let WolftToken;
    let hardhatWolftToken;
    let owner; 
    let otherAccount;
    let provider;
    const supply = 1000_000_000_000_000_000_000_000


    beforeEach(async function () {
        WolftToken = await ethers.getContractFactory("WolftToken");
        [owner, otherAccount] = await ethers.getSigners();
    
        // To deploy
        hardhatWolftToken = await WolftToken.deploy();
        provider = ethers.provider;
      });

      describe("Supply", () => {
        it("Should return totalSupply", async () => {     
          //expect(await hardhatWolftToken.totalSupply()).to.equal(supply);
          console.log("Total Supply: " + await hardhatWolftToken.totalSupply());
        })
      
        it("Should return owner balance equal to totalSupply [mint initial]", async () => {              
            const ownerBalance = await hardhatWolftToken.balanceOf(owner.address);
            expect(await hardhatWolftToken.totalSupply()).to.equal(ownerBalance);
          console.log("Balance of Owner: " + ownerBalance);
        })
      })
   

  });
  