import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import CreateCampaign from "./CreateCampaign";
import CampaignShowcase from "./CampaignShowcase";

class Landing extends Component {
  render() {
    return (
      <div className="">
        <div class="jumbotron" style={{backgroundImage: `url("https://www.bits-pilani.ac.in/Uploads/Hyderabad/adminforhyderabad/Gallery/2015-6-25--15-4-22-702_audi3.jpg")`}}>
          <div class="container">
            <h1 class="display-4 text-center" style={{color:'white'}}>FunDapp</h1>
            <h4 class="text-center" style={{color:'white', fontFamily:'Monospace'}}> A crowdfunding platform </h4>
          </div>
        </div>
        <Switch>
          <Route path="/create-campaign" exact component={CreateCampaign} />
          <Route path="/" exact component={CampaignShowcase} />
        </Switch>
      </div>
    );
  }
}

export default Landing;