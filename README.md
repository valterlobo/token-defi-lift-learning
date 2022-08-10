# Exercícios TOKEN - Defi Lift Learning

## TODO:

1 - Deploy Token

2 - Add liquidez na QuickSwap
+1 pra add na Uniswap V3

3 - Token com 5% de taxa em cada transferência para 0x0000… (burn)

4 - Token onde não donos do contrato só conseguem transferir a partir de 2023 Dica: (block.timestamp)

5 - Contrato de venda de tokens a partir de um depósito em MATIC

## Tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix

npx hardhat verify --list-networks
```
## Metamask - Mumbai Testnet 

Network Name: Mumbai Testnet

New RPC URL: https://rpc-mumbai.maticvigil.com

Chain ID: 80001

Currency Symbol: MATIC

Block Explorer URL: https://mumbai.polygonscan.com/



FAUCET : 
https://faucet.polygon.technology/
https://mumbaifaucet.com/
https://faucets.chain.link/mumbai



## Deploy :
```
WolftTokenTx deployed to: 0x37D826B47053f36026a541dD2d24165f93Bc568F
WolftToken deployed to: 0x5cD7527e756B20E6bcdCB0764D955faF7052Ea12
WolftTokenLock deployed to: 0x7F69761eeF1A03cBE7163237391F8055E2eBeF8e
WolfSwap deployed to: 0x1634cc8812179825FffFC2A3F708ED58E629dCFe
```

- Verificar polygon Scan:

```bash
npx hardhat verify --network matic 0x1634cc8812179825FffFC2A3F708ED58E629dCFe --contract contracts/WolfSwap.sol:WolfSwap  0x5cD7527e756B20E6bcdCB0764D955faF7052Ea12
```

