import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class CategoriesTable extends Component {
  columns = [
    {
      path: "item.name",
      label: "Item",
      width: "5"
      //   content: supplier => (
      //     <Link to={`/suppliers/view/${supplier.id}`}>{supplier.name}</Link>
      //   )
    },
    { path: "serving", label: "Serving", width: "7" },
    { path: "createdDate", label: "Created date", width: "2" },
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
        </div>
      )
    }
  ];

  render() {
    const { recipes, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={recipes}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CategoriesTable;
