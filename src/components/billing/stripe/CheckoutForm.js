import React, { Component } from "react";
import { injectStripe } from "react-stripe-elements";
import CardSection from "./CardSection";
import { Grid, Button } from "semantic-ui-react";
import { payNow } from "../../../services/billingOrderService";
import BlockUi from "react-block-ui";

class CheckoutForm extends Component {
  state = {};
  handleSubmit = async ev => {
    ev.preventDefault();

    this.setState({ blocking: true });

    const { token } = await this.props.stripe.createToken();

    await payNow(token.id);

    this.setState({ blocking: false });

    window.location = "/outlets";
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <form onSubmit={this.handleSubmit}>
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
