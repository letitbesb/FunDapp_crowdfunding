const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

const mnemonic =
  'dust chimney cliff palace coach cross embark merit palace exclude police benefit';
const networkUrl =
  'https://goerli.infura.io/v3/28e1c68f08b54e298fbe6a227264e6cb';

const provider = new HDWalletProvider(mnemonic, networkUrl);
const web3 = new Web3(provider);

var accounts, helper;

const deploy = async () => {
  accounts = await web3.eth.getAccounts();

  helper = await new web3.eth.Contract(
    JSON.parse(compiledCampaignFactory.interface)
  )
    .deploy({
      data: '0x' + compiledCampaignFactory.bytecode
    })
    .send({
      from: accounts[0],
      gas: '2000000'
    });

  console.log('Contract Deployed at Address: ', helper.options.address);
};

deploy();
