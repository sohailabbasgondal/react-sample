import React, { Component } from "react";
import {
  getMenuTypes,
  getMenuDataItems,
  saveMenuDataItem,
  updateMenuDataItem,
  updateMenuDataProductItem,
  updateMenuDataOuterItem,
  getOrderItems,
  deleteOrderItem,
  saveOrderItem,
  getOrderTotal,
  deleteAllOrderItem,
  saveOrderToServer,
  updateMenuDataCombinedItem,
  loadMainMenuData
} from "../../services/terminalService";
import {
  Grid,
  Image,
  Card,
  Table,
  Button,
  Statistic,
  Label,
  Form
} from "semantic-ui-react";
import BlockUi from "react-block-ui";
import Counter from "../order/counter";
import { toast } from "react-toastify";
import { updateMenuItem } from "../../services/menuItemService";

class Terminal extends Component {
  state = {
    menu_types: [],
    visible_menu_types: [],
    orderItems: getOrderItems(),
    show: "none",
    orderType: "dine-in",
    back: "root",
    paymentType: "cash"
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: menu_types } = await getMenuTypes();
    let visible_menu_types = saveMenuDataItem(menu_types);
    this.setState({
      blocking: false,
      menu_types: getMenuDataItems(),
      visible_menu_types
    });
  }

  handleOrderItemDelete = id => {
    deleteOrderItem(id);
    this.loadOrderItems();
  };

  handleOrderItemUpdate = (qty, total, id) => {
    const item = { qty: qty, total: total, id: id };
    saveOrderItem(item);
    this.loadOrderItems();
  };

  cardVisibility() {
    if (this.state.orderItems.length === 0) return "none";
    return "block";
  }

  saveOrder = async () => {
    this.setState({ blocking: true });

    let data = {
      items: this.state.orderItems,
      orderType: this.state.orderType,
      orderTotal: getOrderTotal()
    };

    await saveOrderToServer(data);

    this.setState({ blocking: false });
    toast.success("Order has been placed successfully.");
    deleteAllOrderItem();
    this.loadOrderItems();
    this.handleBack();
    this.setState({ orderType: "dine-in" });
  };

  handleIncrement = item => {
    item.decrement = 0;
    saveOrderItem(item);
    this.loadOrderItems();
  };

  loadOrderItems() {
    const orderItems = getOrderItems();
    this.setState({ orderItems });
  }

  handleDecrement = item => {
    item.decrement = 1;
    saveOrderItem(item);
    this.loadOrderItems();
  };

  handleType = type => {
    if (type.price) {
      this.handleIncrement(type);
    } else {
      this.setState({ show: true });
      if (type.children == undefined && type.items == undefined) {
        let visible_menu_types = updateMenuDataOuterItem(type.id);
        this.setState({ visible_menu_types });
      } else if (type.children !== undefined && type.items !== undefined) {
        let visible_menu_types = updateMenuDataCombinedItem(
          type.children,
          type.items
        );
        this.setState({ visible_menu_types });
      } else if (type.children != undefined && type.children.length > 0) {
        let visible_menu_types = updateMenuDataItem(type.children);
        this.setState({ visible_menu_types });
      } else if (type.items != undefined && type.items.length > 0) {
        let visible_menu_types = updateMenuDataProductItem(type.items);
        this.setState({ visible_menu_types });
      }
    }
  };

  handleBack = () => {
    if (this.state.back === "root") {
      let visible_menu_types = loadMainMenuData(this.state.menu_types);
      this.setState({ visible_menu_types, show: "none" });
    }
  };

  updateOrderType = orderType => {
    this.setState({ orderType });
  };

  updatePaymentType = paymentType => {
    this.setState({ paymentType });
  };

  cancelOrder = () => {
    deleteAllOrderItem();
    this.loadOrderItems();
    this.handleBack();
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={6} style={{ paddingRight: "40px" }}>
              <center>
                <Button.Group>
                  <Button
                    positive={this.state.orderType === "dine-in" ? true : false}
                    onClick={() => this.updateOrderType("dine-in")}
                  >
                    Dine-in
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={
                      this.state.orderType === "delivery" ? true : false
                    }
                    onClick={() => this.updateOrderType("delivery")}
                  >
                    Delivery
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={this.state.orderType === "phone" ? true : false}
                    onClick={() => this.updateOrderType("phone")}
                  >
                    Phone
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={this.state.orderType === "web" ? true : false}
                    onClick={() => this.updateOrderType("web")}
                  >
                    Web
                  </Button>
                </Button.Group>

                <Button.Group style={{ marginTop: "12px" }}>
                  <Button
                    positive={this.state.paymentType === "cash" ? true : false}
                    onClick={() => this.updatePaymentType("cash")}
                  >
                    Cash
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={this.state.paymentType === "card" ? true : false}
                    onClick={() => this.updatePaymentType("card")}
                  >
                    Card
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={this.state.paymentType === "both" ? true : false}
                    onClick={() => this.updatePaymentType("both")}
                  >
                    Both
                  </Button>
                </Button.Group>
              </center>
              <Card style={{ display: this.cardVisibility(), width: "100%" }}>
                <Card.Content>
                  <Label circular color="blue" floating>
                    {this.state.orderItems.length}
                  </Label>
                  <Table>
                    <Table.Body>
                      {this.state.orderItems.map(item => (
                        <Counter
                          item={item}
                          key={item.id}
                          onDelete={this.handleOrderItemDelete}
                          onUpdate={this.handleOrderItemUpdate}
                          onIncrement={this.handleIncrement}
                          onDecrement={this.handleDecrement}
                        />
                      ))}
                    </Table.Body>
                  </Table>

                  <Form>
                    <Statistic color="green" size="tiny">
                      <Statistic.Value>${getOrderTotal()}</Statistic.Value>
                      <Statistic.Label>Order</Statistic.Label>
                    </Statistic>

                    <br />
                    <Button secondary onClick={this.cancelOrder}>
                      Cancel Order
                    </Button>
                    <Button primary onClick={this.saveOrder}>
                      Submit Order
                    </Button>
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column width={10}>
              <Grid columns={6}>
                {this.state.visible_menu_types.map(item => (
                  <Grid.Column key={item.id}>
                    <Image
                      style={{
                        cursor: "pointer"
                      }}
                      bordered
                      size="large"
                      label={{
                        color: "orange",
                        content: item.price
                          ? item.price + " " + item.name
                          : " " + item.name,
                        ribbon: false
                      }}
                      src={
                        item.thumbnail === "" ||
                        item.thumbnail === "http://laravel.local/storage/"
                          ? "/white-image.png"
                          : item.thumbnail
                      }
                      onClick={() => this.handleType(item)}
                    />
                  </Grid.Column>
                ))}
                <Grid.Column key="back">
                  <Image
                    style={{
                      cursor: "pointer",
                      display: this.state.show
                    }}
                    bordered
                    size="large"
                    src={"/back.png"}
                    onClick={this.handleBack}
                  />
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </BlockUi>
    );
  }
}

export default Terminal;
