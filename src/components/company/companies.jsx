import React, { Component } from "react";
import {
  getCompanies,
  deleteCompany,
  updateCompanyStatus
} from "../../services/companyService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import CompaniesTable from "./companiesTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class Companies extends Component {
  state = {
    open: false,
    company: "",
    companies: [],
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true, show: "none" });
    const { data: companies } = await getCompanies();
    this.checkTotalCompanies(companies);
    this.setState({ companies, blocking: false });
  }

  checkTotalCompanies = companies => {
    if (companies.length > 0) {
      this.setState({ show: "none" });
    } else {
      this.setState({ show: "block" });
    }
  };

  handleDelete = company => {
    this.setState({ open: true, company });
  };

  doDelete = async () => {
    const company = this.state.company;
    const originalCompanies = this.state.companies;
    const companies = originalCompanies.filter(o => o.id !== company.id);
    this.setState({ companies, open: false });

    try {
      await deleteCompany(company.id);
      this.checkTotalCompanies(companies);
      toast.success("Company has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This company has already been deleted.");
      }

      this.setState({ companies: originalCompanies });
    }
  };

  handleUpdate = company => {
    return this.props.history.replace("/companies/" + company.id + "/edit");
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

  handleUpdateStatus = async company => {
    this.setState({ blocking: true });
    await updateCompanyStatus(company);
    const { data: companies } = await getCompanies();

    this.setState({ blocking: false, companies });
  };

  handleUpdateManager = company => {
    return this.props.history.replace(
      "/companies/" + company.id + "/manager-edit/" + company.user.id
    );
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      companies: allCompanies,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allCompanies.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allCompanies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const companies = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: companies };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn, show } = this.state;
    const { totalCount, data: companies } = this.getPagedData();
    const otherShow = show === "none" ? "block" : "none";

    if (this.state.companies.length === 0) {
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
                <p>companies not added yet.</p>
                <Link to="/companies/new" className="ui primary button">
                  New Company
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
          content="Are you sure, you want to delete the company?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Companies" icon="tag" />

        <div style={{ display: otherShow }}>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link to="/companies/new" className="ui primary button">
                    New Company
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} companies.</p>

          <CompaniesTable
            companies={companies}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onUpdate={this.handleUpdate}
            onSort={this.handleSort}
            onStatusUpdate={this.handleUpdateStatus}
            onUpdateManager={this.handleUpdateManager}
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

export default Companies;
