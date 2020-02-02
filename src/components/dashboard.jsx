import React, { Component } from "react";
import { Statistic, Grid, Message } from "semantic-ui-react";

import BlockUi from "react-block-ui";
import TableTitle from "./common/tableTitle";

class Dashboard extends Component {
  state = {};

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Statistics" icon="tag" />
      </BlockUi>
    );
  }
}

export default Dashboard;
