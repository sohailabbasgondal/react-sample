import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon } from "semantic-ui-react";
class CashiersTable extends Component {
  columns = [
    {
      path: "user.name",
      label: "Name",
      width: "3"
    },
    { path: "user.email", label: "Email", width: "5" },
    { path: "user.status", label: "Status", width: "3" },
    { path: "createdDate", label: "Added date", width: "2" },
    {
      key: "actions",
      width: "1",
      content: user => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(user)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(user)}
          />
        </div>
      )
    }
  ];

  render() {
    const { cashiers, onSort, sortColumn } = this.props;

    return (
      <RenderTable
        columns={this.columns}
        data={cashiers}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CashiersTable;
