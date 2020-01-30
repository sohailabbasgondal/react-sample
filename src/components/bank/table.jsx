import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon } from "semantic-ui-react";
import auth from "../../services/authService";

class BankTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "3"
    },
    {
      path: "address",
      label: "Address",
      width: "4"
    },
    {
      path: "phone",
      label: "Phone",
      width: "3"
    },
    {
      path: "account",
      label: "Account",
      width: "3"
    },

    {
      key: "actions",
      width: "2",
      content: type =>
        auth.getCurrentUser().role === "company" && (
          <div>
            <Icon
              name="trash"
              color="red"
              className="clickable"
              onClick={() => this.props.onDelete(type)}
            />

            <Icon
              name="edit"
              color="blue"
              className="clickable"
              onClick={() => this.props.onUpdate(type)}
            />
          </div>
        )
    }
  ];

  render() {
    const { types, onSort, sortColumn } = this.props;

    return (
      <RenderTable
        columns={this.columns}
        data={types}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BankTable;
