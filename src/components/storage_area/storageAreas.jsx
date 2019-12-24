import React, { Component } from "react";
import {
  getStorageAreas,
  deleteStorageArea
} from "../../services/storageAreaService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import StorageAreasTable from "./storageAreasTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";

import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class StorageAreas extends Component {
  state = {
    storage_areas: [],
    storgeArea: "",
    open: "",
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true, show: "none" });
    const { data: storage_areas } = await getStorageAreas();
    this.checkTotalStorageAreas(storage_areas);
    this.setState({ storage_areas, blocking: false });
  }

  checkTotalStorageAreas = storage_areas => {
    if (storage_areas.length > 0) {
      this.setState({ show: "none" });
    } else {
      this.setState({ show: "block" });
    }
  };

  handleDelete = storgeArea => {
    this.setState({ open: true, storgeArea });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  doDelete = async () => {
    const storgeArea = this.state.storgeArea;
    const originalStorageAreas = this.state.storage_areas;
    const storage_areas = originalStorageAreas.filter(
      o => o.id !== storgeArea.id
    );
    this.setState({ storage_areas });

    try {
      await deleteStorageArea(storgeArea.id);
      this.checkTotalStorageAreas(storage_areas);
      this.setState({ open: false });

      toast.success("Storage area has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This storage area has already been deleted.");
      }

      this.setState({ storage_areas: originalStorageAreas, open: false });
    }
  };

  handleUpdate = storgeArea => {
    return this.props.history.replace(
      "/storage-areas/" + storgeArea.id + "/edit"
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
      storage_areas: allStorageAreas,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allStorageAreas.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allStorageAreas;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const storage_areas = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: storage_areas };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn, show } = this.state;
    const { totalCount, data: storage_areas } = this.getPagedData();
    const otherShow = show === "none" ? "block" : "none";

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the storage area?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Storage Areas" icon="tag" />

        <div style={{ display: show }}>
          <center>
            <img src={emtpyUrl} />
            <div>
              <p>Storage Areas not added yet.</p>
              <Link to="/storage-areas/new" className="ui primary button">
                New Storage Area
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
                  <Link to="/storage-areas/new" className="ui primary button">
                    New Storage Area
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} storage areas.</p>

          <StorageAreasTable
            storageAreas={storage_areas}
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

export default StorageAreas;
