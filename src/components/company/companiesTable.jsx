import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import Currency from "../common/currency";
class CompaniesTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "2"
    },
    { path: "address", label: "Address", width: "3" },
    { path: "phone", label: "Phone", width: "2" },
    {
      path: "p_o_box",
      label: "P O Box",
      width: "1"
    },
    {
      path: "user.name",
      label: "User Name",
      width: "2"
    },
    {
      path: "user.email",
      label: "User Email",
      width: "3"
    },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: company =>
        company.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },
    {
      key: "actions",
      width: "2",
      content: company => (
        <div>
          <Icon
            name={company.status == 1 ? "hide" : "eye"}
            color={company.status == 1 ? "black" : "green"}
            className="clickable"
            onClick={() => this.props.onStatusUpdate(company)}
          />
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(company)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(company)}
          />

          <Icon
            name="user"
            color="green"
            className="clickable"
            onClick={() => this.props.onUpdateManager(company)}
          />
        </div>
      )
    }
  ];

  render() {
    const { companies, onSort, sortColumn } = this.props;

    return (
      <RenderTable
        columns={this.columns}
        data={companies}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CompaniesTable;
