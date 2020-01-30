import React, { Component } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import UsersTable from "./usersTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class Users extends Component {
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
    const { data: cashiers } = await getUsers("cashier");
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

      toast.success("User has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This user has already been deleted.");
      }

      this.setState({ cashiers: originalCashiers });
    }
  };

  handleUpdate = cashier => {
    return this.props.history.replace("/users/" + cashier.id + "/edit");
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
    if (count === 0) return <p>There are no user in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the user?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />

        <TableTitle title="Users" icon="tag" />

        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{ paddingBottom: 0 }}>
                <SearchTextBox onSearchButtonClick={this.handleSearching} />
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Link to="/users/new" className="ui primary button">
                  New User
                </Link>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <p>Showing {totalCount} users.</p>

        <UsersTable
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

export default Users;
