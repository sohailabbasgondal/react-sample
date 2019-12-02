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
    this.setState({ blocking: true });
    const { data: suppliers } = await getSuppliers();
    this.setState({ suppliers, blocking: false });
  }

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
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: suppliers } = this.getPagedData();
    const { length: count } = suppliers.length;
    if (count === 0) return <p>There are no suppliers in the store.</p>;

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
      </BlockUi>
    );
  }
}

export default Suppliers;
