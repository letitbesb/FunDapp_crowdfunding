import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class CampaignRequests extends Component {
  state = {
    requests: [],
    backers: '',
    errorMessage: '',
    approvalLoading: false,
    approved: false,
    finalizeLoading: false,
    finalized: false,
    processingIndex: null
  };

  campaign;

  componentDidMount() {
    this.fetchRequests();
  }

  fetchRequests = async () => {
    this.campaign = Campaign(this.props.match.params.id);
    const requestsCount = await this.campaign.methods.getRequestsCount().call();
    const backersCount = await this.campaign.methods.backersCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestsCount, 10))
        .fill()
        .map((element, index) => {
          return this.campaign.methods.requests(index).call();
        })
    );
    this.setState({
      requests,
      backers: backersCount
    });
  };

  onApprove = async index => {
    this.setState({
      approvalLoading: true,
      errorMessage: '',
      approved: false,
      processingIndex: index
    });

    const accounts = await web3.eth.getAccounts();
    try {
      await this.campaign.methods.approveRequest(index).send({
        from: accounts[0]
      });

      setTimeout(() => {
        this.fetchRequests();
        this.setState({
          approved: true,
          approvalLoading: false,
          processingIndex: null
        });
      }, 2000);
    } catch (err) {
      if (
        err.message ===
        'No "from" address specified in neither the given options, nor the default options.'
      ) {
        err.message =
        'Please check your metamask connection!';
      }
      this.setState({
        errorMessage: err.message,
        approvalLoading: false,
        processingIndex: null
      });
    }
  };

  onFinalize = async index => {
    this.setState({
      finalizeLoading: true,
      errorMessage: '',
      finalized: false,
      processingIndex: index
    });

    const accounts = await web3.eth.getAccounts();
    try {
      await this.campaign.methods.finalizeRequest(index).send({
        from: accounts[0]
      });

      setTimeout(() => {
        this.fetchRequests();
        this.setState({
          finalized: true,
          finalizeLoading: false,
          processingIndex: null
        });
      }, 2000);
    } catch (err) {
      if (
        err.message ===
        'No "from" address specified in neither the given options, nor the default options.'
      ) {
        err.message =
          'Please check your metamask connection!';
      }
      this.setState({
        errorMessage: err.message,
        finalizeLoading: false,
        processingIndex: null
      });
    }
  };

  renderRow = () => {
    return this.state.requests.map((request, index) => {
      return (
        <tr key={index} className="animated fadeIn">
          <th scope="row">{index}</th>
          <td style={{fontFamily: 'Times-Italic'}}>{request.description}</td>
          <td style={{fontFamily: 'Times-Italic'}}>{web3.utils.fromWei(request.value, 'ether')}</td>
          <td style={{fontFamily: 'Times-Italic'}}>{request.recipient}</td>
          <td style={{fontFamily: 'Times-Italic'}}>
            {request.approvalCount}/{this.state.backers}
          </td>
          <td style={{fontFamily: 'Times-Italic'}}>
            {request.complete ? null : this.state.approvalLoading &&
            this.state.processingIndex == index ? (
              <button className="btn btn-sm disabled animated fadeIn"
              style={{backgroundColor:"#2f4f4f"}}>
                <i className="fa fa-refresh fa-spin mr-3"> </i>
                Approving
              </button>
            ) : (
              <button
                className="btn animated fadeIn" style={{backgroundColor: "#2f4f4f"}}
                onClick={() => this.onApprove(index)}
              >
                Approve
              </button>
            )}
          </td>
          <td style={{fontFamily: 'Times-Italic'}}>
            {request.complete ? (
              <button className="btn btn-mdb-color btn disabled animated fadeIn" style={{backgroundColor: "#deb887"}}>
                Finalized!
              </button>
            ) : this.state.finalizeLoading &&
            this.state.processingIndex == index ? (
              <button className="btn" style={{backgroundColor: "#deb887"}}>
                <i className="fa fa-refresh fa-spin mr-3"> </i>
                Finalizing
              </button>
            ) : (
              <button
                className="btn animated fadeIn" style={{backgroundColor: "#deb887"}}
                onClick={() => this.onFinalize(index)}
              >
                Finalize
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  renderTable = () => {
    return (
        <table class="table table-striped table-bordered table-dark table-hover ">
        <thead>
          <tr>
            <th style={{fontFamily: 'Courier'}} scope="col">Number</th>
            <th  style={{fontFamily: 'Courier'}} scope="col">Description</th>
            <th style={{fontFamily: 'Courier'}} scope="col">Money(ETH)</th>
            <th style={{fontFamily: 'Courier'}} scope="col">Recipient</th>
            <th style={{fontFamily: 'Courier'}} scope="col">Approvals</th>
            <th style={{fontFamily: 'Courier'}} scope="col">Backer Approve</th>
            <th style={{fontFamily: 'Courier'}} scope="col">Manager Finalize</th>
          </tr>
        </thead>
        <tbody>{this.renderRow()}</tbody>
      </table>
    );
  };

  render() {
    let errorAlert = null;
    let approvedAlert = null;
    let finalizedAlert = null;

    if (this.state.errorMessage) {
      errorAlert = (
        <div
          className="alert alert-danger mt-4 z-depth-2 text-center animated fadeIn"
          role="alert"
        >
          <strong>Error: Please make sure you are a Backer if you are Aprroving & You are a manager if you are Finalizing. Also, you cannot Aprrove Twice!!</strong>
        </div>
      );
    }

    if (this.state.approved) {
      approvedAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          You have successfully approved the request!
        </div>
      );
    }

    if (this.state.finalized) {
      finalizedAlert = (
        <div
          className="alert alert-success mt-4 z-depth-2 clearfix text-center animated fadeIn"
          style={{ fontSize: '20px' }}
          role="alert"
        >
          Request is successfully finalized and the payment is transfered to the
          recipient.
        </div>
      );
    }

    const breadcrum = (
      <nav className="breadcrumb" style={{backgroundColor: "#fffff0"}}>
        <Link to="/" className="breadcrumb-item">
          FunDapp
        </Link>
        <Link
          to={`/campaigns/${this.props.match.params.id}`}
          className="breadcrumb-item"
        >
          Campaign Details
        </Link>
        <span className="breadcrumb-item active">Withdrawal Requests</span>
      </nav>
    );

    return (
      <div className="container animated fadeIn mt-5">
        {breadcrum}
        <div className="clearfix">
          <Link to={this.props.match.url + '/create-request'} >
            <button style={{fontFamily: 'Times-Italic',backgroundColor: "#f08080"}} className="btn float-right">Create Request</button>
          </Link>
        </div>
        <div className="mt-5">{this.renderTable()}</div>
        <div style={{ marginTop: '75px' }}>
          {errorAlert} {approvedAlert} {finalizedAlert}
        </div>
      </div>
    );
  }
}

export default CampaignRequests;