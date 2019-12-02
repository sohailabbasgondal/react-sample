import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class MenuItemsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "10"
      //   content: supplier => (
      //     <Link to={`/suppliers/view/${supplier.id}`}>{supplier.name}</Link>
      //   )
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
