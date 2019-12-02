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
import { Table, Confirm } from "semantic-ui-react";

class Outlets extends Component {
  state = {
    outlets: [],
    open: false,
    outlet: "",
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: outlets } = await getOutlets();
    this.state.blocking = false;
    this.setState({ outlets, blocking: false });
  }

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
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: outlets } = this.getPagedData();
    const { length: count } = outlets.length;
    if (count === 0) return <p>There are no outlets in the store.</p>;

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

export default Outlets;
