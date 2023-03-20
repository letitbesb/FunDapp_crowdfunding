import web3 from './web3';
import compiledCampaignFactory from './build/CampaignFactory.json';

const campaignFactory = new web3.eth.Contract(
  JSON.parse(compiledCampaignFactory.interface),
  '0xd618CE7CC46EB084bF268C60804D74f785503db6'
);

export default campaignFactory;
