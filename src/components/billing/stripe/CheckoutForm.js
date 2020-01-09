import React, { Component } from "react";
import { injectStripe } from "react-stripe-elements";
import CardSection from "./CardSection";
import { Grid, Button } from "semantic-ui-react";
import { payNow } from "../../../services/billingOrderService";
import BlockUi from "react-block-ui";
import auth from "../../../services/authService";
import { Link, withRouter } from "react-router-dom";

class CheckoutForm extends React.Component {
  state = {};

  handleSubmit = async ev => {
    ev.preventDefault();

    const { token } = await this.props.stripe.createToken();

    if (token != undefined) {
      this.setState({ blocking: true });

      await payNow(token.id);
      auth.refresh();

      this.setState({ blocking: false });
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <form id="formPay" onSubmit={this.handleSubmit}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <CardSection />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16} style={{ textAlign: "center" }}>
                <Button primary>Pay</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </form>
      </BlockUi>
    );
  }
}

export default injectStripe(CheckoutForm);
