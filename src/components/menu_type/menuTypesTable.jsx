import React, { Component } from "react";
import Table from "../common/table";
import { Icon, Label } from "semantic-ui-react";

class MenuTypesTable extends Component {
  columns = [
    {
      path: "thumbnail",
      label: "Thumbnail",
      width: "1",
      content: menuType => (
        <div>
          <img
            width="50"
            src={
              process.env.REACT_APP_BACKEND_URL +
              "/storage/" +
              menuType.thumbnail
            }
          />
        </div>
      )
    },
    {
      path: "parent.name",
      label: "Parent category",
      width: "2",
      content: menuType => (
        <div>{menuType.parent === null ? "Root" : menuType.parent.name}</div>
      )
    },
    {
      path: "name",
      label: "Name",
      width: "11"
    },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: menuType =>
        menuType.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },

    {
      key: "actions",
      width: "1",
      content: menuType => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(menuType)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(menuType)}
          />
        </div>
      )
    }
  ];

  render() {
    const { menuTypes, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={menuTypes}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MenuTypesTable;
