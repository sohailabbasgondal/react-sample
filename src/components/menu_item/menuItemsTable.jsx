import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class MenuItemsTable extends Component {
  columns = [
    {
      path: "thumbnail",
      label: "Thumbnail",
      width: "1",
      content: menuItem => (
        <div>
          <img width="50" src={menuItem.thumbnail} />
        </div>
      )
    },
    {
      path: "name",
      label: "Name",
      width: "7"
    },
    {
      path: "price",
      label: "Price",
      width: "2"
    },
    { path: "status", label: "Status", width: "2" },
    { path: "createdDate", label: "Created date", width: "2" },
    {
      key: "actions",
      width: "2",
      content: menuItem => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(menuItem)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(menuItem)}
          />

          <Icon
            name="utensils"
            color="blue"
            className="clickable"
            onClick={() => this.props.onRecipeUpdate(menuItem)}
          />
        </div>
      )
    }
  ];

  render() {
    const { menuItems, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={menuItems}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MenuItemsTable;
