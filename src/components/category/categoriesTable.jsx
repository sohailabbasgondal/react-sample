import React, { Component } from "react";
import Table from "../common/table";
import { Icon, Label } from "semantic-ui-react";

class CategoriesTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "5"
    },
    { path: "description", label: "Description", width: "7" },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: category =>
        category.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },

    {
      key: "actions",
      width: "1",
      content: category => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(category)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(category)}
          />
        </div>
      )
    }
  ];

  render() {
    const { categories, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={categories}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CategoriesTable;
