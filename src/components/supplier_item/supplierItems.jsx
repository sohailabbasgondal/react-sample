import React, { Component } from "react";
import { getItems, deleteItem } from "../../services/itemService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SupplierItemsTable from "./supplierItemsTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import {
  Table,
  Confirm,
  Grid,
  Card,
  Form,
  Button,
  Label,
  Statistic
} from "semantic-ui-react";
import Input from "../common/input";
import Select from "../common/select";

import { getCategories } from "../../services/categoryService";
// import Form from "../common/form";
import { getSuppliers } from "../../services/supplierService";
import { getStorageAreas } from "../../services/storageAreaService";
import {
  getOrderItems,
  deleteOrderItem,
  saveOrderItem,
  getOrderTotal,
  saveOrderToServer,
  deleteAllOrderItem
} from "../../services/orderService";
import Counter from "../order/counter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Currency from "../common/currency";

class SupplierItems extends Component {
  state = {
    startDate: new Date(),
    items: [],
    item: "",
    orderItems: getOrderItems(),

    open: false,
    pageSize: 10,
    currentPage: 1,

    sortColumn: { path: "title", order: "asc" },
    noRecordFound: "",
    categories: [],
    suppliers: [],
    storage_areas: [],

    keyFieldValue: "",
    category_id: "",
    supplier_id: "",
    storage_area_id: ""
  };

  async componentDidMount() {
    const { data: cats } = await getCategories();
    const categories = [{ id: "", name: "All Categories" }, ...cats];

    const { data: supps } = await getSuppliers();
    const suppliers = [{ id: "", name: "All Suppliers" }, ...supps];

    const { data: areas } = await getStorageAreas();
    const storage_areas = [{ id: "", name: "All Storage Areas" }, ...areas];

    this.setState({ blocking: true });
    const { data: items } = await getItems();
    this.state.blocking = false;
    this.setState({
      items,
      blocking: false,
      categories,
      suppliers,
      storage_areas
    });
  }

  handleDelete = item => {
    this.setState({ open: true, item });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  doDelete = async () => {
    const item = this.state.item;
    const originalItems = this.state.items;
    const items = originalItems.filter(o => o.id !== item.id);
    this.setState({ items });

    try {
      await deleteItem(item.id);
      toast.success("Item has been updated successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This item has already been deleted.");
      }

      this.setState({ items: originalItems });
    }
  };

  handleUpdate = item => {
    return this.props.history.replace("/items/" + item.id + "/edit");
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearching = (keyword, category_id, supplier_id, storage_area_id) => {
    this.setState({
      keyFieldValue: keyword,
      category_id,
      supplier_id,
      storage_area_id,
      currentPage: 1
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      items: allItems,
      sortColumn,
      keyFieldValue,
      category_id,
      supplier_id,
      storage_area_id
    } = this.state;

    let filtered = allItems;

    console.log(keyFieldValue + "==" + category_id);

    filtered = keyFieldValue
      ? allItems.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : filtered;

    filtered = category_id
      ? filtered.filter(m => m.category.id == category_id)
      : filtered;

    filtered = supplier_id
      ? filtered.filter(m => m.supplier.id == supplier_id)
      : filtered;

    filtered = storage_area_id
      ? filtered.filter(m => m.storage_area.id == storage_area_id)
      : filtered;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const items = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: items };
  };
  clearFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("category_id").value = "";
    document.getElementById("supplier_id").value = "";
    document.getElementById("storage_area_id").value = "";
    this.setState({
      data: { category_id: "", storage_area_id: "", supplier_id: "" }
    });
    document.getElementById("searcBtn").click();
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
      order_delivery_date: this.state.startDate,
      message: document.getElementById("message").value,
      items: this.state.orderItems
    };

    await saveOrderToServer(data);

    this.setState({ blocking: false });
    toast.success("Order has been placed successfully.");
    deleteAllOrderItem();
    this.loadOrderItems();
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

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: items } = this.getPagedData();
    const { length: count } = items.length;
    if (count === 0) return <p>There are no items in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the item?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />

        <Grid>
          <Grid.Column width={16} style={{ paddingBottom: 0 }}>
            <TableTitle title="Items" icon="tag" />
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell style={{ paddingBottom: 0 }}>
                    <Table
                      style={{
                        border: "0px",
                        marginBottom: "6px",
                        marginLeft: "-4px",
                        marginRight: "-4px"
                      }}
                    >
                      <Table.Body className="ui form">
                        <Table.Row>
                          <Table.Cell>
                            <Input
                              id="keyword"
                              name="keyword"
                              style={{ width: "100%" }}
                              placeholder="Search by keyword"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Select
                              name="category_id"
                              id="category_id"
                              options={this.state.categories}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Select
                              name="supplier_id"
                              id="supplier_id"
                              options={this.state.suppliers}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Select
                              name="storage_area_id"
                              id="storage_area_id"
                              options={this.state.storage_areas}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <button
                              onClick={() =>
                                this.handleSearching(
                                  document.getElementById("keyword").value,
                                  document.getElementById("category_id").value,
                                  document.getElementById("supplier_id").value,
                                  document.getElementById("storage_area_id")
                                    .value
                                )
                              }
                              id="searcBtn"
                              className="ui primary button"
                              type="button"
                            >
                              Search
                            </button>
                            &nbsp;
                            <button
                              onClick={() => this.clearFilters()}
                              className="ui secondary button"
                              type="button"
                            >
                              Reset
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Link to="/items/new" className="ui primary button">
                      New Item
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <p>Showing {totalCount} items.</p>
          </Grid.Column>
        </Grid>

        <Grid>
          <Grid.Column width={11}>
            <SupplierItemsTable
              items={items}
              sortColumn={sortColumn}
              onDelete={this.handleDelete}
              onUpdate={this.handleUpdate}
              onSort={this.handleSort}
              onIncrement={this.handleIncrement}
              onDecrement={this.handleDecrement}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <Card style={{ display: this.cardVisibility(), width: "100%" }}>
              <Card.Content>
                <Card.Header>
                  Order Detail
                  <Label circular color="blue" floating>
                    {this.state.orderItems.length}
                  </Label>
                </Card.Header>
              </Card.Content>
              <Card.Content>
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
                  <Form.TextArea id="message" label="Message" />
                  <div className="field">
                    <label>Delivery date</label>
                    <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChange}
                    />
                  </div>

                  <Statistic color="green" size="tiny">
                    <Statistic.Value>
                      <Currency label="" />
                      {getOrderTotal()}
                    </Statistic.Value>
                    <Statistic.Label>Order</Statistic.Label>
                  </Statistic>

                  <br />
                  <Button secondary>Cancel</Button>
                  <Button primary onClick={this.saveOrder}>
                    Send
                  </Button>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </BlockUi>
    );
  }
}

export default SupplierItems;
