import React, { Component } from 'react';
import { ShowCard } from './ui-components/mdb-stateless-components';
import { Link } from 'react-router-dom';

import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';

class CampaignShowcase extends Component {
  state = {
    renderCampaigns: null,
    otherNetwork: null,
    firefoxCORSError: false
  };

  async componentDidMount() {
    try {
      const network = await web3.eth.net.getNetworkType();
      

      const campaigns = await factory.methods.getDeployedCampaigns().call();

      const campaignCards = campaigns.map(address => {
        return <ShowCard address={address} key={address} route={address} />;
      });

      this.setState({ renderCampaigns: campaignCards });
    } catch (err) {
      if ('Invalid JSON RPC response: ""' === err.message) {
        this.setState({ firefoxCORSError: true });
      }
    }
  }

  render() {
    let networkError = this.state.otherNetwork ? (
      <div
        className="alert alert-danger text-center"
        role="alert"
        style={{ fontSize: '25px', marginTop: '75px' }}
      >
        <div className="mt-3 mb-3">
          Please check if you are on the correct network i.e Goerli Test-net.
        </div>
      </div>
    ) : null;

    let corsError = this.state.firefoxCORSError ? (
      <div
        className="alert alert-danger text-center"
        role="alert"
        style={{ fontSize: '25px', marginTop: '75px' }}
      >
        <div className="mt-3 mb-3">
          Cross-Origin Request Blocked <strong>@Firefox</strong>.<br />
          We strongly recommend you to use browsers like Chrome, Brave or any
          other Wallet-enabled browser in order to interact with FunDapp.
        </div>
      </div>
    ) : null;

    return (
      <div className="container" style={{ maxWidth:"50rem"}}>
        <div className="">
          <Link to="/create-campaign">
            <button type="button" className="btn float-right" style={{ borderRadius: '100px', backgroundColor: 'black'}}>
              Create Campaign
            </button>
          </Link>
        </div>
        <h1 className=""><strong>Available Campaigns</strong><hr style={{ border: '1px dotted'}}></hr></h1>
        <div className="">{this.state.renderCampaigns}</div>
        {corsError} {networkError}
      </div>
    );
  }
}

export default CampaignShowcase;