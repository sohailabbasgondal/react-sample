import React, { Component } from "react";
import { getItem } from "../../services/itemService";
import TableTitle from "../common/tableTitle";
import { Table, Button } from "semantic-ui-react";
import BlockUi from "react-block-ui";

class SupplierItemDetail extends Component {
  state = {
    item: { category: {}, storage_area: {}, unit: {}, supplier: {} }
  };

  async getItemDetail() {
    try {
      this.setState({ blocking: true });
      const itemId = this.props.match.params.id;
      const { data: item } = await getItem(itemId);

      this.setState({ item, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.getItemDetail();
    this.setState({ blocking: false });
  }

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Item detail" icon="tag" />

        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={2}>Name</Table.Cell>
              <Table.Cell>{this.state.item.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Code</Table.Cell>
              <Table.Cell>{this.state.item.code}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Category</Table.Cell>
              <Table.Cell>{this.state.item.category.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Supplier</Table.Cell>
              <Table.Cell>{this.state.item.supplier.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Stock</Table.Cell>
              <Table.Cell>{this.state.item.stock}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Unit</Table.Cell>
              <Table.Cell>{this.state.item.unit.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Price</Table.Cell>
              <Table.Cell>{this.state.item.price}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Discount</Table.Cell>
              <Table.Cell>{this.state.item.discount}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Storage</Table.Cell>
              <Table.Cell>{this.state.item.storage_area.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Threshold</Table.Cell>
              <Table.Cell>{this.state.item.threshold}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Ideal stock</Table.Cell>
              <Table.Cell>{this.state.item.ideal_stock}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Price valid till</Table.Cell>
              <Table.Cell>{this.state.item.price_valid_till}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Button
          className="ui secondary button"
          onClick={() => this.props.history.push("/items")}
        >
          Back
        </Button>
      </BlockUi>
    );
  }
}

export default SupplierItemDetail;
