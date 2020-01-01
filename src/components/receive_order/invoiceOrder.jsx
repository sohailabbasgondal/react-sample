import React, { Component } from "react";
import {
  getOrderDetails,
  updateOrderToServer
} from "../../services/orderService";
import {
  Table,
  Grid,
  Button,
  Segment,
  Portal,
  Header
} from "semantic-ui-react";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import InvoiceOrderItem from "./invoiceOrderItem";
import { toast } from "react-toastify";
import {
  saveOrderItems,
  getReceivedOrderItems,
  updateOrderItem,
  deleteOrderItem,
  saveDeletedItems,
  getDeletedItems
} from "../../services/receiveOrderService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Form from "../common/form";
import Joi from "joi-browser";
import Currency from "../common/currency";

class InvoiceOrder extends Form {
  state = {
    order: { supplier: {}, total_items: [] },
    receivedOrder: [],
    deletedItems: [],
    invoiceDate: new Date(),
    data: {
      invoiceId: "",
      tax: "",
      shipping: "",
      total: "",
      comments: ""
    },
    errors: {},
    items_total: 0,
    open: false,
    portal_message: ""
  };

  schema = {
    invoiceId: Joi.string()
      .required()
      .label("Invoice Id"),
    tax: Joi.number()
      .required()
      .label("Tax"),
    shipping: Joi.number()
      .required()
      .label("Shipping"),
    total: Joi.number()
      .required()
      .label("Total"),
    comments: Joi.string().label("Comments")
  };

  calculateItemsTotal = () => {
    let total = 0;
    this.state.receivedOrder.map(item => {
      total = total + Number(item.price * item.received);
    });
    this.setState({ items_total: total });
  };
  async getOrderDetail() {
    try {
      this.setState({ blocking: true });
      const orderId = this.props.match.params.id;
      const { data: order } = await getOrderDetails(orderId);

      order.total_items.map(item => saveOrderItems(item));
      const receivedOrder = getReceivedOrderItems();

      this.setState({ order, receivedOrder, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.getOrderDetail();
    this.calculateItemsTotal();
    this.setState({ blocking: false });
  }

  handleConfirm = (itemId, checked) => {
    let checkBoxVal;
    if (checked) {
      checkBoxVal = 1;
    } else {
      checkBoxVal = 0;
    }
    updateOrderItem(itemId, checkBoxVal, "confirm");
    this.loadOrderItems();
  };

  handleDelete = item => {
    deleteOrderItem(item);
    this.loadOrderItems();
    saveDeletedItems(item);
    this.loadDeletedItems();
  };

  handleQtyUpdate = (itemId, val) => {
    updateOrderItem(itemId, val, "qty");
    this.calculateItemsTotal();
    this.loadOrderItems();
  };

  handlePriceUpdate = (itemId, val) => {
    updateOrderItem(itemId, val, "price");
    this.calculateItemsTotal();
    this.loadOrderItems();
  };

  loadDeletedItems() {
    const deletedItems = getDeletedItems();
    this.setState({ deletedItems });
  }

  loadOrderItems() {
    const receivedOrder = getReceivedOrderItems();
    this.setState({ receivedOrder });
  }

  doSubmit = async () => {
    let verifyConfirmed = 1;
    this.state.receivedOrder.map(item => {
      if (item.confirmed === 0) {
        verifyConfirmed = 0;
      }
    });
    if (verifyConfirmed === 0) {
      this.handleOpen(
        'Please confirm all items, using "Confirm" checkbox available for each item.'
      );
      return false;
    }

    if (this.state.items_total != this.state.data.total) {
      this.handleOpen(
        'Please be sure, your entered correct value in "Total as below" field.'
      );
      return false;
    }

    //processing submit
    const { invoiceId, tax, shipping, total, comments } = this.state.data;
    let data = {
      doc_invoice_number: invoiceId,
      doc_invoice_date: this.state.invoiceDate,
      tax: tax,
      shipping: shipping,
      total: total,
      comments: comments,
      order: this.state.receivedOrder,
      orderId: this.props.match.params.id,
      deleted_items: this.state.deletedItems
    };

    try {
      this.setState({ blocking: true });
      await updateOrderToServer(data);
      this.setState({ blocking: false });
      toast.success("Order has been added to inventory successfully.");
      this.props.history.push("/receive-orders");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  reloadScreen() {
    window.location.reload();
  }

  handleChangePicker = date => {
    this.setState({
      invoiceDate: date
    });
  };

  handleClose = () => this.setState({ open: false });
  handleOpen = msg => this.setState({ open: true, portal_message: msg });

  render() {
    let pageHeader = `${this.state.order.supplier.name} Invoice`;
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title={pageHeader} icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Button
                  className="ui secondary button"
                  onClick={() =>
                    this.props.history.push(
                      `/receive-orders/view/${this.props.match.params.id}`
                    )
                  }
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="ui secondary button"
                  onClick={this.reloadScreen}
                >
                  Reset all changes
                </Button>
              </Grid.Column>

              <Grid.Column width={4} style={{ textAlign: "right" }}>
                {this.renderButton("Confirm Order")}
                <Portal onClose={this.handleClose} open={this.state.open}>
                  <Segment
                    style={{
                      left: "40%",
                      position: "fixed",
                      top: "50%",
                      zIndex: 1000
                    }}
                  >
                    <Header>Warning</Header>
                    <p>{this.state.portal_message}</p>

                    <Button
                      content="Close"
                      negative
                      onClick={this.handleClose}
                    />
                  </Segment>
                </Portal>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={2} divided style={{ marginTop: "0px" }}>
            <Grid.Row>
              <Grid.Column>
                <Table definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={4}>Invoice #</Table.Cell>
                      <Table.Cell>
                        {this.renderInput("invoiceId", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>Invoice date</Table.Cell>
                      <Table.Cell>
                        <DatePicker
                          selected={this.state.invoiceDate}
                          onChange={this.handleChangePicker}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>
                        <Currency label="Total as below" />
                      </Table.Cell>
                      <Table.Cell>
                        {this.renderInput("total", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column>
                <Table definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={4}>
                        <Currency label="Tax" />
                      </Table.Cell>
                      <Table.Cell>
                        {this.renderInput("tax", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>
                        <Currency label="Shipping" />
                      </Table.Cell>
                      <Table.Cell>
                        {this.renderInput("shipping", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </form>

        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Item code</Table.HeaderCell>
              <Table.HeaderCell width={3}>Item name</Table.HeaderCell>
              <Table.HeaderCell width={2}>Item unit</Table.HeaderCell>
              <Table.HeaderCell width={1}>Order qty</Table.HeaderCell>
              <Table.HeaderCell width={2}>
                <Currency label="Price" />
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                <Currency label="Total" />
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>Received</Table.HeaderCell>
              <Table.HeaderCell width={1}>Confirm</Table.HeaderCell>
              <Table.HeaderCell width={1}>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.receivedOrder.map(item => (
              <InvoiceOrderItem
                key={item.id}
                onConfirm={this.handleConfirm}
                onDelete={this.handleDelete}
                onQtyUpdate={this.handleQtyUpdate}
                onPriceUpdate={this.handlePriceUpdate}
                item={item}
              />
            ))}
          </Table.Body>
        </Table>
        <Grid columns={2} style={{ marginTop: "0px" }}>
          <Grid.Row>
            <Grid.Column width={11} className="form ui">
              {/* <textarea
                name="comments"
                value={this.state.comments}
                onChange={this.handleComments}
                style={{ width: "100%", height: "100%" }}
                cols="100"
              ></textarea> */}
              {this.renderTextarea("comments", "", "text")}
            </Grid.Column>
            <Grid.Column width={5}>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>
                      <Currency label="Items total" />
                    </Table.Cell>
                    <Table.Cell>{this.state.items_total}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Total items</Table.Cell>
                    <Table.Cell>{this.state.receivedOrder.length}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>
                      <Currency label="Discount" />
                    </Table.Cell>
                    <Table.Cell>0</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>
                      <Currency label="Sub total" />
                    </Table.Cell>
                    <Table.Cell>{this.state.items_total}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </BlockUi>
    );
  }
}

export default InvoiceOrder;
