import React, { Component } from "react";
import Table from "../common/table";
import { Icon, Label } from "semantic-ui-react";

class StorageAreasTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "4"
    },
    { path: "description", label: "Description", width: "8" },
    {
      path: "status",
      label: "Status",
      width: "1",
      content: storageArea =>
        storageArea.status == 1 ? (
          <Label color="green">Enbled</Label>
        ) : (
          <Label color="yellow">Disabled</Label>
        )
    },
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
