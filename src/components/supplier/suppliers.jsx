import React, { Component } from "react";
import { getSuppliers, deleteSupplier } from "../../services/supplierService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import SuppliersTable from "./suppliersTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import _ from "lodash";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class Suppliers extends Component {
  state = {
    open: false,
    supplier: "",
    suppliers: [],
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true, show: "none" });
    const { data: suppliers } = await getSuppliers();
    this.checkTotalSuppliers(suppliers);
    this.setState({ suppliers, blocking: false });
  }

  checkTotalSuppliers = suppliers => {
    if (suppliers.length > 0) {
      this.setState({ show: "none" });
    } else {
      this.setState({ show: "block" });
    }
  };

  handleDelete = supplier => {
    this.setState({ open: true, supplier });
  };

  doDelete = async () => {
    const supplier = this.state.supplier;
    const originalSuppliers = this.state.suppliers;
    const suppliers = originalSuppliers.filter(o => o.id !== supplier.id);
    this.setState({ suppliers, open: false });

    try {
      await deleteSupplier(supplier.id);
      this.checkTotalSuppliers(suppliers);
      toast.success("Supplier has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This supplier has already been deleted.");
      }

      this.setState({ suppliers: originalSuppliers });
    }
  };

  handleUpdate = supplier => {
    return this.props.history.replace("/suppliers/" + supplier.id + "/edit");
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
      suppliers: allSuppliers,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allSuppliers.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allSuppliers;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const suppliers = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: suppliers };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn, show } = this.state;
    const { totalCount, data: suppliers } = this.getPagedData();
    const otherShow = show === "none" ? "block" : "none";
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the supplier?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Suppliers" icon="tag" />
        <div style={{ display: show }}>
          <center>
            <img src={emtpyUrl} />
            <div>
              <p>Suppliers not added yet.</p>
              <Link to="/suppliers/new" className="ui primary button">
                New Supplier
              </Link>
            </div>
          </center>
        </div>

        <div style={{ display: otherShow }}>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link to="/suppliers/new" className="ui primary button">
                    New Supplier
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} suppliers.</p>

          <SuppliersTable
            suppliers={suppliers}
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
        </div>
      </BlockUi>
    );
  }
}

export default Suppliers;
