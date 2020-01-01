import React, { Component } from "react";
import { Label, Button, Icon, Table } from "semantic-ui-react";
import Currency from "../common/currency";

class Counter extends Component {
  render() {
    const { title, id, qty, total } = this.props.item;

    return (
      <Table.Row>
        <Table.Cell width={1} collapsing>
          <Label circular color="green">
            {qty}
          </Label>
        </Table.Cell>
        <Table.Cell width={9}>
          {title} <br /> <Currency label="" />
          {total}
        </Table.Cell>

        <Table.Cell width={5}>
          <Button
            onClick={() => this.props.onIncrement(this.props.item)}
            className="mini green"
          >
            +
          </Button>
          <Button
            onClick={() => this.props.onDecrement(this.props.item)}
            className="mini red"
          >
            -
          </Button>
        </Table.Cell>
        <Table.Cell width={1}>
          <Icon onClick={() => this.props.onDelete(id)} link name="close" />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Counter;
