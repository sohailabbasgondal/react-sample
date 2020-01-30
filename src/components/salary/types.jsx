import React, { Component } from "react";
import {
  getSalaries,
  deleteSalary,
  updateSalaryStatus
} from "../../services/salaryService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import SalaryTable from "./typesTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";
import auth from "../../services/authService";

class Salaries extends Component {
  state = {
    open: false,
    type: "",
    types: [],
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "work_date", order: "desc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true, show: "none" });
    const { data: types } = await getSalaries();
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
      await deleteSalary(type.id);
      this.checkTotalTypes(types);
      toast.success("Ledger type has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This ledger type has already been deleted.");
      }

      this.setState({ types: originalTypes });
    }
  };

  handleDetail = type => {
    return this.props.history.replace("/salaries/view/" + type.id);
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
          m =>
            m.work_date.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allTypes;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const types = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: types };
  };

  render() {
    if (auth.getCurrentUser().role != "salary-admin") {
      return "Your are authorized to perform this action.";
    }

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
                <p>Salaries not added yet.</p>
                <Link to="/salaries/new" className="ui primary button">
                  Add Daily Salary
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
        <TableTitle title="Salaries" icon="tag" />

        <div style={{ display: otherShow }}>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link to="/salaries/new" className="ui primary button">
                    Add Daily Salary
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} salaries.</p>

          <SalaryTable
            types={types}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onSort={this.handleSort}
            onDetail={this.handleDetail}
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

export default Salaries;
