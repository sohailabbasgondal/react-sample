import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import { Icon, Button, Label, Grid } from "semantic-ui-react";

class SupplierItemsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "3",
      content: item => <Link to={`/items/view/${item.id}`}>{item.name}</Link>
    },
    // { path: "storage_area.name", label: "Storage area", width: "2" },
    { path: "unit.name", label: "Unit", width: "3" },
    // { path: "category.name", label: "Category", width: "2" },
    // { path: "supplier.name", label: "Supplier", width: "3" },
    { path: "price", label: "Price", width: "1" },
    { path: "stock", label: "Stock", width: "1" },
    { path: "ideal_stock", label: "Ideal Stock", width: "2" },
    {
      key: "qty",
      label: "Quantity",
      width: "3",
      content: item => (
        <Label>
          <Grid>
            <Grid.Column width={8}>
              <Button
                onClick={() => this.props.onIncrement(item)}
                className="mini green"
              >
                +
              </Button>
            </Grid.Column>
            {/* <Grid.Column width={4}>d</Grid.Column> */}
            <Grid.Column width={8}>
              <Button
                onClick={() => this.props.onDecrement(item)}
                className="mini red"
              >
                -
              </Button>
            </Grid.Column>
          </Grid>
        </Label>
      )
    },
    {
      key: "actions",
      width: "2",
      content: item => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(item)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(item)}
          />
        </div>
      )
    }
  ];

  render() {
    const { items, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={items}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default SupplierItemsTable;
