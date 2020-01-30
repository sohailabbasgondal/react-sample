import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import auth from "../../services/authService";

class YardTypesTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "4"
    },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: type =>
        type.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },
    {
      key: "actions",
      width: "2",
      content: type =>
        auth.getCurrentUser().role === "company" && (
          <div>
            <Icon
              name={type.status == 1 ? "hide" : "eye"}
              color={type.status == 1 ? "black" : "green"}
              className="clickable"
              onClick={() => this.props.onStatusUpdate(type)}
            />
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

export default YardTypesTable;
