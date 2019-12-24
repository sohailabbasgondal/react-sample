import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
class WaitersTable extends Component {
  columns = [
    {
      path: "user.name",
      label: "Name",
      width: "5"
    },
    { path: "user.email", label: "Email", width: "9" },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: user =>
        user.user.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },
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

export default WaitersTable;
