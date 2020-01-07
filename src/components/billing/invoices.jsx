import React, { Component } from "react";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";

class Invoices extends Component {
  state = {
    invoices: []
  };
  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { invoices } = this.state;
    if (invoices.length == 0)
      return (
        <div>
          <center>
            <img src={emtpyUrl} />
            <div>
              <p>Invoices not available yet.</p>
            </div>
          </center>
        </div>
      );

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="My Invoices" icon="tag" />
      </BlockUi>
    );
  }
}

export default Invoices;
