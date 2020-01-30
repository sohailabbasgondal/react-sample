import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import auth from "../../services/authService";

class RoomTable extends Component {
  columns = [
    {
      path: "room_number",
      label: "Room Number",
      width: "3"
    },
    {
      path: "name",
      label: "Incharge Name",
      width: "4"
    },
    {
      path: "mobile",
      label: "Incharge Mobile",
      width: "3"
    },
    {
      path: "rent",
      label: "Rent",
      width: "3"
    },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: type =>
        type.status == 1 ? (
          <Label color="green">Occupied</Label>
        ) : (
          <Label color="red">Empty</Label>
        )
    },
    {
      key: "actions",
      width: "2",
      content: type => (
        <div>
          {auth.getCurrentUser().role === "company" && (
            <React.Fragment>
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
            </React.Fragment>
          )}
          <Icon
            name="info"
            color="blue"
            className="clickable"
            onClick={() => this.props.onDetail(type)}
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

export default RoomTable;
