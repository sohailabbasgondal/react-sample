import React, { Component } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import WaitersTable from "./waitersTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class Waiters extends Component {
  state = {
    open: false,
    cashier: "",
    cashiers: [],
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: cashiers } = await getUsers("waiter");
    this.setState({ cashiers, blocking: false });
  }

  handleDelete = cashier => {
    this.setState({ open: true, cashier });
  };

  doDelete = async () => {
    const cashier = this.state.cashier;
    const originalCashiers = this.state.cashiers;
    const cashiers = originalCashiers.filter(o => o.id !== cashier.id);
    this.setState({ cashiers, open: false });

    try {
      await deleteUser(cashier.id);

      toast.success("Waiter has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This waiter has already been deleted.");
      }

      this.setState({ cashiers: originalCashiers });
    }
  };

  handleUpdate = cashier => {
    return this.props.history.replace("/waiters/" + cashier.id + "/edit");
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleCancel = () => {
    this.setState({ open: false });
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
      cashiers: allCashiers,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allCashiers.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allCashiers;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const cashiers = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: cashiers };
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: cashiers } = this.getPagedData();
    const { length: count } = cashiers.length;
    if (count === 0) return <p>There are no waiters in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the waiter?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />

        <TableTitle title="Waiters" icon="tag" />

        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{ paddingBottom: 0 }}>
                <SearchTextBox onSearchButtonClick={this.handleSearching} />
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Link to="/waiters/new" className="ui primary button">
                  New Waiter
                </Link>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <p>Showing {totalCount} waiters.</p>

        <WaitersTable
          cashiers={cashiers}
          sortColumn={sortColumn}
          onDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
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

export default Waiters;
