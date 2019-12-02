import React, { Component } from "react";
import { getMenuTypes, deleteMenuType } from "../../services/menuTypeService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import MenuTypesTable from "./menuTypesTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";

import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class MenuTypes extends Component {
  state = {
    menu_types: [],
    menuType: "",
    open: "",
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: menu_types } = await getMenuTypes();
    this.setState({ menu_types, blocking: false });
  }

  handleDelete = menuType => {
    this.setState({ open: true, menuType });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  doDelete = async () => {
    const menuType = this.state.menuType;
    const originalMenuTypes = this.state.menu_types;
    const menu_types = originalMenuTypes.filter(o => o.id !== menuType.id);
    this.setState({ menu_types });

    try {
      await deleteMenuType(menuType.id);
      this.setState({ open: false });

      toast.success("Menu type has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This menu type has already been deleted.");
      }

      this.setState({ menu_types: originalMenuTypes, open: false });
    }
  };

  handleUpdate = menuType => {
    return this.props.history.replace("/menu-types/" + menuType.id + "/edit");
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
      menu_types: allMenuTypes,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allMenuTypes.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allMenuTypes;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const menu_types = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: menu_types };
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: menu_types } = this.getPagedData();
    const { length: count } = menu_types.length;
    if (count === 0) return <p>There are no menu types in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the menu type?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Menu Types" icon="tag" />

        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{ paddingBottom: 0 }}>
                <SearchTextBox onSearchButtonClick={this.handleSearching} />
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Link to="/menu-types/new" className="ui primary button">
                  New Menu Type
                </Link>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <p>Showing {totalCount} menu types.</p>

        <MenuTypesTable
          menuTypes={menu_types}
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

export default MenuTypes;
