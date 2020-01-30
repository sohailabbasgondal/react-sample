import React, { Component } from "react";
import {
  getLedgerTypes,
  deleteLedgerType,
  updateLedgerTypeStatus
} from "../../services/roomLedgerTypeService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import TypesTable from "./typesTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class RoomTypes extends Component {
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
    const { data: types } = await getLedgerTypes();
    this.checkTotalTypes(types);
    this.setState({ types, blocking: false });
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
      await deleteLedgerType(type.id);
      this.checkTotalTypes(types);
      toast.success("Ledger type has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This ledger type has already been deleted.");
      }

      this.setState({ types: originalTypes });
    }
  };

  handleUpdate = type => {
    return this.props.history.replace(
      "/rooms-ledgers-types/" + type.id + "/edit"
    );
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
    await updateLedgerTypeStatus(type);
    const { data: types } = await getLedgerTypes();

    this.setState({ blocking: false, types });
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
                <p>Ledger types not added yet.</p>
                <Link
                  to="/rooms-ledgers-types/new"
                  className="ui primary button"
                >
                  New Ledger Type
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
          content="Are you sure, you want to delete the type?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Rooms ledger types" icon="tag" />

        <div style={{ display: otherShow }}>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link
                    to="/rooms-ledgers-types/new"
                    className="ui primary button"
                  >
                    New Ledger Type
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} types.</p>

          <TypesTable
            types={types}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onSort={this.handleSort}
            onStatusUpdate={this.handleUpdateStatus}
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

export default RoomTypes;
