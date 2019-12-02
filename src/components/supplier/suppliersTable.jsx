import React, { Component } from "react";
import RenderTable from "../common/table";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
class SuppliersTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "3"
      //   content: supplier => (
      //     <Link to={`/suppliers/view/${supplier.id}`}>{supplier.name}</Link>
      //   )
    },
    { path: "emails", label: "Emails", width: "5" },
    { path: "phone", label: "Phone", width: "3" },
    { path: "min_order_value", label: "Min order value", width: "2" },
    { path: "createdDate", label: "Added date", width: "2" },
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
