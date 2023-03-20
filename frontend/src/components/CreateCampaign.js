import React, { Component } from 'react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Link } from 'react-router-dom';

class CreateCampaign extends Component {
  state = {
    minimumContribution: '',
    campaignName: '',
    errorMessage: '',
    loading: false,
    created: false,
    campaign_address: ''
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      errorMessage: '',
      created: false,
      campaign_address: '',
      loading: true
    });

    try {
      if (this.state.minimumContribution == 0) {
        throw Error('Please enter some minimum contribution value');
      }

      if (!this.state.campaignName) {
        throw Error('Please enter a name for the campaign');
      }

      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution, this.state.campaignName)
        .send({
          from: accounts[0]
        });

      const campaign_address = await factory.methods.recentCampaign().call();
      this.setState({
        created: true,
        loading: false,
        campaign_address
      });
    } catch (err) {
      if (
        err.message ===
        'No "from" address specified in neither the given options, nor the default options.'
      ) {
        err.message =
          'Please check your Metamask connection';
      }
      this.setState({ errorMessage: err.message, loading: false });
    }
  };

  render() {
    let errorAlert = null;
    let successAlert = null;

    if (this.state.created) {
      successAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix mb-5 text-center animated fadeIn"
          style={{ fontSize: '15px' }}
          role="alert"
        >
          Great! Your campaign is successfully created and deployed on the Ethereum blockchain. <br />
          Address:
          <strong className="ml-2" style={{ fontSize: '24px' }}>
            {this.state.campaign_address}
          </strong>
          <Link to={'campaigns/' + this.state.campaign_address}>
            <div className='text-center'>
            <button type="button" className="btn btn-success mt-3" style={{borderRadius:"50px"}}>
              View Campaign
            </button>
            </div>
          </Link>
        </div>
      );
    }

    const breadcrum = (
      <nav className="breadcrumb" style={{backgroundColor:"#fffff0"}}>
        <Link to="/" className="breadcrumb-item">
          FunDapp
        </Link>

        <span className="breadcrumb-item active">Create Campaign</span>
      </nav>
    );

    return (
      <div className="container mt-5 mb-5" style={{maxWidth:"50rem"}}>
        {breadcrum}
        <div className="ml-3">
          <h1 className="">Create Campaign</h1>

          <form onSubmit={this.onSubmit}>
            <div className="md-form mt-5">
              <input
                type="text"
                placeholder="Please enter the minimum donation amount in Wei to become a backer"
                id="form1"
                className="form-control form-control-lg mt-4"
                value={this.state.minimumContribution}
                onChange={event =>
                  this.setState({ minimumContribution: event.target.value })
                }
              />
              <input
                type="text"
                placeholder="Name of the Campaign"
                id="form1"
                className="form-control form-control-lg mt-4"
                value={this.state.campaignName}
                onChange={event =>
                  this.setState({ campaignName: event.target.value })
                }
              />
              {this.state.loading ? (
                <div className='text-center'>
                  <button
                    type="submit"
                    className="btn btn-lg mt-4"
                    style={{backgroundColor:"#BA1380",borderRadius:"50px"}}
                    disabled
                  >
                    <i className="fa fa-refresh fa-spin mr-3"> </i>
                    Creating...
                  </button>
                  <div style={{ fontSize: '20px' , marginTop:"20px"}} className="">
                    Work in Progress! Please Wait...
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn mt-4" style={{backgroundColor:"#BA1380",borderRadius:"50px"}}
                  >
                    Create !
                  </button>
                </div>
              )}
              {errorAlert} {successAlert}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateCampaign;
