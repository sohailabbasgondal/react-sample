import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import Currency from "../common/currency";
class SuppliersTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "4"
    },
    { path: "emails", label: "Emails", width: "5" },
    { path: "phone", label: "Phone", width: "2" },
    {
      path: "min_order_value",
      label: <Currency label="Min order value" />,
      width: "3"
    },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: supplier =>
        supplier.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },
    {
      key: "actions",
      width: "1",
      content: supplier => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(supplier)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(supplier)}
          />
        </div>
      )
    }
  ];

  render() {
    const { suppliers, onSort, sortColumn } = this.props;

    return (
      <RenderTable
        columns={this.columns}
        data={suppliers}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default SuppliersTable;
