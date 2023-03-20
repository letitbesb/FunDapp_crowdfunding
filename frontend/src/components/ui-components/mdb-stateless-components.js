import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Campaign from '../../ethereum/campaign';

export class ShowCard extends Component {
  state = {
    campaignName: ''
  };
  async componentDidMount() {
    const campaign = Campaign(this.props.address);
    const campaignName = await campaign.methods.campaignName().call();
    this.setState({ campaignName });
  }

  render() {
    return (
      <div className="card mt-4" style={{backgroundColor:"#184028"}}>
        <div className="card-body">
          <h3 className="card-title" style={{color:'#ffffff' }}>
            {this.state.campaignName}
          </h3>
          <h5 className="card-title" style={{fontSize: '10px',color:'#ffffff'}}>{this.props.address}</h5>
          <Link to={'campaigns/' + this.props.route}>
            <button className="btn float-right" style={{ borderRadius:'50px', backgroundColor:'#ff0080' }}>View Campaign</button>
          </Link>
        </div>
      </div>
    );
  }
}

export const DetailCard = props => {
  return (
    <div className="text-center" style={{color:"white",minWidth:"20rem", backgroundColor:"#184028"}}>
    <div className=" mt-2 animated fadeIn">
      <div className="z-depth-2">
        <div className="" style={{ height: '150px' }}>
          <div className="card-body">
            <h2 className="card-title">{props.title}</h2>
            <h4 className="card-title">{props.meta}</h4>
            <p className="card-text">{props.description}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export const CampaignTron = props => {
  return (
    <div className="text-center" style={{ paddingTop: '25px', paddingBottom:"25px",backgroundColor: '#4691a3', color:'white'}}>
      <h1 className="h1-reponsive mb text-uppercase" style={{fontFamily:'Times-Italic', color:'black', letterSpacing: '2px', paddingBottom:"20px" }}>
        <strong>{props.campaignName}</strong>
      </h1>
      <h3
        className="h3-responsive"
        style={{ wordWrap: 'break-word', fontSize: '15px'}}
      >
        Address of Campaign's Smart Contract: {props.contractAddress}
      </h3>
      <h4
        className="h3-responsive"
        style={{ wordWrap: 'break-word',fontSize: '15px' }}
      >
        Managed by: {props.manager}
      </h4>
    </div>
  );
};

export const Jumbotron = props => {
  return (
    <div className="z-depth-4">
      <div
        className="jumbotron jumbotron-fluid"
        style={{
          backgroundColor: 'grey'
        }}
      >
        <div className="container text-center">
          <h1 className="h1-reponsive mb-4 mt-2 text-white display-4">
            {props.title}
          </h1>
          <p className="lead text-white">{props.children}</p>
          <br />
          <Link to="/create-campaign">
            <button className="btn btn-outline-white btn-rounded">
              <i className="fa fa-plus left" /> {props.buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};