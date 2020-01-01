import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import OrderTotal from "../order/orderTotal";
import { Label } from "semantic-ui-react";
import Currency from "../common/currency";

class SupplierOrdersTable extends Component {
  columns = [
    {
      path: "outlet_order_counter",
      label: "Order Id",
      width: "2",
      content: order => (
        <Link to={`/orders/view/${order.id}`}>
          Order{order.outlet_order_counter}
        </Link>
      )
    },
    { path: "order_delivery_date", label: "Delivery date", width: "3" },
    { path: "created_at", label: "Order date", width: "3" },
    { path: "supplier.name", label: "Supplier", width: "3" },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: order =>
        order.status == 1 ? (
          <Label color="yellow">Pending</Label>
        ) : (
          <Label color="green">Delivered</Label>
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
      label: <Currency label="Estimated price" />,
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

export default SupplierOrdersTable;
