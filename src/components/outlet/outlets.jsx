import React, { Component } from "react";
import { getOutlets, deleteOutlet } from "../../services/outletService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import OutletsTable from "./outletsTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";

import { StripeProvider } from "react-stripe-elements";
import MyStoreCheckout from "../billing/stripe/MyStoreCheckout";

import {
  Table,
  Confirm,
  Grid,
  Label,
  Card,
  Statistic,
  Form
} from "semantic-ui-react";

import Currency from "../common/currency";
import Counter from "../order/counter";

import {
  getOrderItems,
  initilizeData,
  saveOrderItem,
  getOrderTotal,
  getPaymentPlatforms,
  checkIfSubscribed
} from "../../services/billingOrderService";

class Outlets extends Component {
  state = {
    outlets: [],
    open: false,
    outlet: "",
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: "",
    orderItems: [],
    platforms: []
  };

  async componentDidMount() {
    let orderItems = initilizeData();

    let platforms = getPaymentPlatforms();

    this.setState({ blocking: true, orderItems, platforms });
    const { data: outlets } = await getOutlets();
    this.state.blocking = false;
    this.setState({ outlets, blocking: false });
  }

  handleIncrement = item => {
    item.decrement = 1;
    saveOrderItem(item);
    this.loadOrderItems();
  };

  loadOrderItems() {
    const orderItems = getOrderItems();
    this.setState({ orderItems });
  }

  handleDecrement = item => {
    item.decrement = 0;
    saveOrderItem(item);
    this.loadOrderItems();
  };

  handleDelete = outlet => {
    this.setState({ open: true, outlet });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  doDelete = async () => {
    const outlet = this.state.outlet;
    const originaOutlts = this.state.outlets;
    const outlets = originaOutlts.filter(o => o.id !== outlet.id);
    this.setState({ outlets, open: false });

    try {
      await deleteOutlet(outlet.id);
      toast.success("Outlet has been updated successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This post has already been deleted.");
      }

      this.setState({ outlets: originaOutlts });
    }
  };

  handleUpdate = outlet => {
    return this.props.history.replace("/outlets/" + outlet.id + "/edit");
  };

  handleUpdateManager = outlet => {
    return this.props.history.replace(
      "/outlets/" + outlet.id + "/manager-edit/" + outlet.user.id
    );
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearching = keyword => {
    this.setState({ keyFieldValue: keyword, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      outlets: allOutlets,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allOutlets.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allOutlets;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const outlets = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: outlets };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: outlets } = this.getPagedData();

    if (this.state.outlets.length === 0) {
      return (
        <BlockUi
          tag="div"
          blocking={this.state.blocking}
          style={{ display: this.state.blocking ? "none" : "block" }}
        >
          <div>
            <center>
              <img src={emtpyUrl} />
              <div>
                <p>Outlets not added yet.</p>
                <Link to="/outlets/new" className="ui primary button">
                  New Outlet
                </Link>
              </div>
            </center>
          </div>
        </BlockUi>
      );
    }

    if (!checkIfSubscribed()) {
      return (
        <React.Fragment>
          <TableTitle title="Outlets" icon="tag" />
          <Grid>
            <Grid.Column width={4}></Grid.Column>
            <Grid.Column width={8}>
              Outlets for the account are not added yet, add atleast one outlet
              to continue and{" "}
              <i>
                <b>payment will be charged on monthly basis</b>
              </i>
              .
            </Grid.Column>
            <Grid.Column width={4}></Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column width={4}></Grid.Column>
            <Grid.Column width={8}>
              <Card style={{ width: "100%" }}>
                <Card.Content>
                  <Card.Header>
                    Pay and create your outlet(s)
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
                    <Statistic color="green" size="tiny">
                      <Statistic.Value>
                        <Currency label="" />
                        {getOrderTotal()}
                      </Statistic.Value>
                      <Statistic.Label>Order</Statistic.Label>
                    </Statistic>

                    {this.state.platforms.map(platform => (
                      <Card style={{ width: "130px" }}>
                        <Card.Content>
                          <img
                            onClick={() => this.handlePayment(platform.id)}
                            src={
                              process.env.REACT_APP_BACKEND_URL +
                              "/" +
                              platform.image
                            }
                          />
                        </Card.Content>
                      </Card>
                    ))}

                    <StripeProvider apiKey="pk_test_TVUmK08pDzzDlxwfymvG1i0m00mxjNn6KY">
                      <MyStoreCheckout />
                    </StripeProvider>
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}></Grid.Column>
          </Grid>
        </React.Fragment>
      );
    } else {
      return (
        <BlockUi tag="div" blocking={this.state.blocking}>
          <Confirm
            open={this.state.open}
            header="Confirmation"
            content="Are you sure, you want to delete the outlet?"
            onCancel={this.handleCancel}
            onConfirm={this.doDelete}
            size="mini"
          />
          <TableTitle title="Outlets" icon="tag" />

          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link to="/outlets/new" className="ui primary button">
                    New Outlet
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} outlets.</p>

          <OutletsTable
            outlets={outlets}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onUpdateManager={this.handleUpdateManager}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </BlockUi>
      );
    }
  }
}

export default Outlets;
