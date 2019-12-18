import React, { Component } from "react";
import { getOrders } from "../../services/cashierOrderService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import CashierOrdersTable from "./cashierOrdersTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table, Confirm, Grid } from "semantic-ui-react";
import Input from "../common/input";
import Select from "../common/select";
import { getUsers } from "../../services/userService";

class CashierOrders extends Component {
  state = {
    startDate: new Date(),
    orders: [],
    item: "",

    open: false,
    pageSize: 10,
    currentPage: 1,

    sortColumn: { path: "title", order: "asc" },
    noRecordFound: "",
    cashiers: [],

    keyFieldValue: "",
    cashier_id: ""
  };

  async componentDidMount() {
    const { data: users } = await getUsers();
    const cashiers = [{ id: "", name: "All Cashiers" }];

    for (const [index, value] of users.entries()) {
      cashiers.push({ id: value.user.id, name: value.user.name });
    }

    this.setState({ blocking: true });
    const { data: orders } = await getOrders();
    this.state.blocking = false;
    this.setState({
      orders,
      blocking: false,
      cashiers
    });
  }

  handleDelete = item => {
    this.setState({ open: true, item });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  handleUpdate = item => {
    return this.props.history.replace("/items/" + item.id + "/edit");
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearching = (keyword, cashier_id) => {
    this.setState({
      keyFieldValue: keyword,
      cashier_id,
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
      orders: allOrders,
      sortColumn,
      keyFieldValue,
      cashier_id
    } = this.state;

    let filtered = allOrders;

    filtered = keyFieldValue
      ? allOrders.filter(m => m.outlet_order_counter == keyFieldValue)
      : filtered;

    filtered = cashier_id
      ? filtered.filter(m => m.user.id == cashier_id)
      : filtered;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const orders = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: orders };
  };

  clearFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("cashier_id").value = "";
    this.setState({
      data: { cashier_id: "" }
    });
    document.getElementById("searcBtn").click();
  }

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: orders } = this.getPagedData();
    const { length: count } = orders.length;
    if (count === 0) return <p>There are no orders in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Grid>
          <Grid.Column width={16} style={{ paddingBottom: 0 }}>
            <TableTitle title="Cashiers Orders" icon="tag" />
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
                              name="cashier_id"
                              id="cashier_id"
                              options={this.state.cashiers}
                            />
                          </Table.Cell>

                          <Table.Cell>
                            <button
                              onClick={() =>
                                this.handleSearching(
                                  document.getElementById("keyword").value,
                                  document.getElementById("cashier_id").value
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
            <p>Showing {totalCount} orders.</p>
          </Grid.Column>
        </Grid>

        <Grid>
          <Grid.Column width={16}>
            <CashierOrdersTable
              orders={orders}
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
        </Grid>
      </BlockUi>
    );
  }
}

export default CashierOrders;
