import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class StorageAreasTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "4"
      //   content: supplier => (
      //     <Link to={`/suppliers/view/${supplier.id}`}>{supplier.name}</Link>
      //   )
    },
    { path: "description", label: "Description", width: "7" },
    { path: "status", label: "Status", width: "2" },
    { path: "createdDate", label: "Created date", width: "2" },
    {
      key: "actions",
      width: "1",
      content: storageArea => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(storageArea)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(storageArea)}
          />
        </div>
      )
    }
  ];

  render() {
    const { storageAreas, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={storageAreas}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default StorageAreasTable;
