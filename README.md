# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

```
EquityToken deployed to: 0x76fF6A4599b69561B500FAa18981b540A50b692C
WhiteListManager deployed to: 0xaF60c1A5fb9f878F3CB09758b6449843c09DbE7C
Deploying EquityVesting...
EquityVesting deployed to: 0xD1621e7E2b6Bd89EE72C1efa9FA89CFd3b148DDf
Successfully submitted source code for contract
contracts/utils/TestEquityToken.sol:TestEquityToken at 0x76fF6A4599b69561B500FAa18981b540A50b692C
for verification on the block explorer. Waiting for verification result...

Successfully verified contract TestEquityToken on the block explorer.
https://sepolia.etherscan.io/address/0x76fF6A4599b69561B500FAa18981b540A50b692C#code
Successfully submitted source code for contract
contracts/EquityVesting.sol:EquityVesting at 0xD1621e7E2b6Bd89EE72C1efa9FA89CFd3b148DDf
for verification on the block explorer. Waiting for verification result...

Successfully verified contract EquityVesting on the block explorer.
https://sepolia.etherscan.io/address/0xD1621e7E2b6Bd89EE72C1efa9FA89CFd3b148DDf#code
Successfully submitted source code for contract
contracts/utils/WhitelistManager.sol:WhitelistManager at 0xaF60c1A5fb9f878F3CB09758b6449843c09DbE7C
for verification on the block explorer. Waiting for verification result...

Successfully verified contract WhitelistManager on the block explorer.
https://sepolia.etherscan.io/address/0xaF60c1A5fb9f878F3CB09758b6449843c09DbE7C#code

Deployed on  Sepolia Testnet
```
```