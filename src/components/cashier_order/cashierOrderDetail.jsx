import React, { Component } from "react";
import CashierOrderInfo from "../order/cashierOrderInfo";
import { Button } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";

class CashierOrderDetail extends Component {
  render() {
    return (
      <div>
        <TableTitle title="Cashier Order detail" icon="tag" />
        <Button
          className="ui secondary button"
          onClick={() => this.props.history.push("/cashiers-orders")}
        >
          Back
        </Button>

        <CashierOrderInfo id={this.props.match.params.id} />
      </div>
    );
  }
}

export default CashierOrderDetail;
