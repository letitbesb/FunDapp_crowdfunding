import React, { Component } from 'react';
import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';
import { Link } from 'react-router-dom';
import { DetailCard } from '../ui-components/mdb-stateless-components';

class CampaignDetails extends Component {
  state = {
    summary: null,
    value: '',
    loading: false,
    errorMessage: '',
    contributed: false
  };

  campaign;

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    this.campaign = Campaign(this.props.match.params.id);
    let summary = await this.campaign.methods.getSummary().call();
    //though the above summary var looks like an array, however, it's an object with keys beint 0,1...

    summary = {
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      backersCount: summary[3],
      manager: summary[4]
    };

    this.setState({ summary: summary });
  };

  renderDetails() {
    const items = [
      {
        title: web3.utils.fromWei(this.state.summary.balance, 'ether'),
        meta: 'Amount Collected in ETH',
        description:
          'Amount of money this campaign has left to spend'
      },
      {
        title: this.state.summary.minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'Contribute atleast this much wei to this campaign in order to become a backer'
      },
      {
        title: this.state.summary.backersCount,
        meta: 'Number of Backers',
        description:
          'Number of people who have already donated to this campaign'
      },
      {
        title: this.state.summary.requestCount,
        meta: 'Number of Requests',
        description:
          "A request tries to withdraw money from campaign's smart contract. Finalizing a request requires approval from backers"
      }
    ];

    return items.map(item => {
      return (
        <DetailCard
          title={item.title}
          meta={item.meta}
          description={item.description}
          key={item.meta}
        />
      );
    });
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({
      errorMessage: '',
      contributed: false,
      loading: true
    });

    try {
      if (
        parseInt(web3.utils.toWei(this.state.value, 'ether'), 10) <
        parseInt(this.state.summary.minimumContribution, 10)
      ) {
        throw Error(
          "You must contribute more than the campaign's specified minimum in order to become a backer."
        );
      }

      const accounts = await web3.eth.getAccounts();
      await this.campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      setTimeout(() => {
        this.fetchSummary();
        this.setState({ contributed: true, loading: false });
      }, 2000);
    } catch (err) {
      if (
        err.message ===
        'No "from" address specified in neither the given options, nor the default options.'
      ) {
        err.message =
          'Metamask (operating over Rinkeby n/w) is required to contribute! Please check if you are signed into metamask.';
      }
      this.setState({ errorMessage: err.message, loading: false });
    }
  };

  render() {
    let errorAlert = null;
    let successAlert = null;

    

    if (this.state.contributed) {
      successAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          Yay! You successfully contributed to the campaign. <br />
          <div><strong style={{ fontSize: '25px' }}>You are now a backer. </strong></div>
          Therefore, you have the ability to participate in request approvals.
        </div>
      );
    }

    const form = (
      <form onSubmit={this.onSubmit}>
        <div className="md-form">
          <h2>Contribute to the Campaign</h2>
          <input
            type="text"
            id="form1"
            className="form-control form-control-lg mt-4 w-25 m-auto text-center"
            placeholder="Amount in ETH"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />
          {this.state.loading ? (
            <div>
              <button
                className="btn btn-lg mt-4 animated fadeIn"
                style={{backgroundColor:"pink",borderRadius:'50px'}}
              >
                <i className="fa fa-refresh fa-spin mr-3"> </i>
                Contributing...
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="btn btn-lg mt-4"
              style={{color:"white", backgroundColor:'#f70063',borderRadius:'50px'}}
            >
              Contribute !
            </button>
          )}
        </div>
      </form>
    );

    const breadcrum = (
      <nav className="breadcrumb mt-5" style={{backgroundColor:"#FFFFF0"}}>
        <Link to="/" className="breadcrumb-item">
          FunDapp
        </Link>

        <span className="breadcrumb-item active">Campaign Details</span>
      </nav>
    );

    if (this.state.summary) {
      return (
        <div className="container mb-5">
          {breadcrum}
          <div className="text-center">{form}</div>
          {errorAlert}
          {successAlert}
          <div className="" style={{}}>{this.renderDetails()}</div>
          <div className="text-center mt-5">
            <Link to={`${this.props.match.url}/requests`}>
              <button className="btn btn-lg" style={{color:"white", backgroundColor:'#f70063', borderRadius:'50px'}}>
                View Requests
              </button>
            </Link>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default CampaignDetails;