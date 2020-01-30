import React, { Component } from "react";
import {
  getAll,
  deleteSingle,
  updateSingleStatus
} from "../../services/yardService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import YardTable from "./table";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class Yards extends Component {
  state = {
    open: false,
    type: "",
    types: [],
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true, show: "none" });
    const { data: types } = await getAll();
    this.checkTotalTypes(types);
    this.setState({ types: types, blocking: false });
  }

  checkTotalTypes = types => {
    if (types.length > 0) {
      this.setState({ show: "none" });
    } else {
      this.setState({ show: "block" });
    }
  };

  handleDelete = type => {
    this.setState({ open: true, type });
  };

  doDelete = async () => {
    const type = this.state.type;
    const originalTypes = this.state.types;
    const types = originalTypes.filter(o => o.id !== type.id);
    this.setState({ types, open: false });

    try {
      await deleteSingle(type.id);
      this.checkTotalTypes(types);
      toast.success("Account has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This Account has already been deleted.");
      }

      this.setState({ types: originalTypes });
    }
  };

  handleUpdate = type => {
    return this.props.history.replace("/yards-accounts/" + type.id + "/edit");
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

  handleUpdateStatus = async type => {
    this.setState({ blocking: true });
    await updateSingleStatus(type);
    const { data: types } = await getAll();

    this.setState({ blocking: false, types: types.data });
  };

  handleOnDetail = type => {
    return this.props.history.replace("/yards-accounts/view/" + type.id);
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      types: allTypes,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allTypes.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allTypes;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const types = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: types };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn, show } = this.state;
    const { totalCount, data: types } = this.getPagedData();
    const otherShow = show === "none" ? "block" : "none";

    if (this.state.types.length === 0) {
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
                <p>Accounts not added yet.</p>
                <Link to="/yards-accounts/new" className="ui primary button">
                  New Account
                </Link>
              </div>
            </center>
          </div>
        </BlockUi>
      );
    }

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the account?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Yards Accounts" icon="tag" />

        <div style={{ display: otherShow }}>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link to="/yards-accounts/new" className="ui primary button">
                    New Account
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} types.</p>

          <YardTable
            types={types}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onSort={this.handleSort}
            onStatusUpdate={this.handleUpdateStatus}
            onDetail={this.handleOnDetail}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </BlockUi>
    );
  }
}

export default Yards;
