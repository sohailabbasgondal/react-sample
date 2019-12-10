import React, { Component } from "react";
import { Checkbox, Icon, Table, Input } from "semantic-ui-react";

class InvoiceOrderItem extends Component {
  render() {
    const {
      id,
      code,
      name,
      unit,
      qty,
      price,
      received,
      confirmed
    } = this.props.item;

    const inputId = "input" + id;
    const checkBoxId = "checkbox" + id;
    const priceId = "price" + id;

    let bg = "",
      color = "";
    if (confirmed === 1) {
      bg = "blue";
      color = "white";
    }

    return (
      <Table.Row style={{ backgroundColor: bg, color: color }}>
        <Table.Cell>{code}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{unit}</Table.Cell>
        <Table.Cell>{qty}</Table.Cell>
        <Table.Cell>
          <Input
            id={priceId}
            type="text"
            onChange={() =>
              this.props.onPriceUpdate(
                id,
                document.getElementById(priceId).value
              )
            }
            value={price}
            style={{ width: "100px" }}
          />
        </Table.Cell>
        <Table.Cell>{Number(price * qty)}</Table.Cell>
        <Table.Cell>
          <Input
            id={inputId}
            type="text"
            onChange={() =>
              this.props.onQtyUpdate(id, document.getElementById(inputId).value)
            }
            value={received}
            style={{ width: "70px" }}
          />
        </Table.Cell>
        <Table.Cell>
          <Checkbox
            id={checkBoxId}
            onClick={() =>
              this.props.onConfirm(
                id,
                document.getElementById(checkBoxId).checked
              )
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Icon onClick={() => this.props.onDelete(id)} link name="trash" />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default InvoiceOrderItem;
