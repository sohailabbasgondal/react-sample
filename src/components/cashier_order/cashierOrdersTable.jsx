import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import OrderTotal from "../order/orderTotal";
import { Label } from "semantic-ui-react";
import Currency from "../common/currency";

class CashierOrdersTable extends Component {
  columns = [
    {
      path: "outlet_order_counter",
      label: "Order Id",
      width: "2",
      content: order => (
        <Link to={`/cashiers-orders/view/${order.id}`}>
          Order{order.outlet_order_counter}
        </Link>
      )
    },
    { path: "created_at", label: "Order date", width: "3" },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: order =>
        order.status == 1 ? (
          <Label color="blue">New</Label>
        ) : order.status == 2 ? (
          <Label color="yellow">Pending</Label>
        ) : order.status == 3 ? (
          <Label color="red">Ready</Label>
        ) : order.status == 4 ? (
          <Label color="green">Finished</Label>
        ) : (
          ""
        )
    },
    {
      path: "total_items",
      label: "Total items",
      width: "2",
      content: order => order.total_items.length
    },
    {
      path: "total_items1",
      label: <Currency label="Price" />,
      width: "2",
      content: order => <OrderTotal key={order.id} items={order.total_items} />
    }
  ];

  render() {
    const { orders, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={orders}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CashierOrdersTable;
