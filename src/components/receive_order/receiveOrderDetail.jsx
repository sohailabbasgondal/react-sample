import React, { Component } from "react";
import OrderDetail from "../order/orderDtail";
import { Button } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";

class ReceiveOrderDetail extends Component {
  render() {
    return (
      <div>
        <TableTitle title="Order detail" icon="tag" />
        <Button
          className="ui secondary button"
          onClick={() => this.props.history.push("/orders")}
        >
          Back
        </Button>

        <OrderDetail id={this.props.match.params.id} />
      </div>
    );
  }
}

export default ReceiveOrderDetail;
