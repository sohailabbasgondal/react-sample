import React, { Component } from "react";
import { getMenuItems, deleteMenuItem } from "../../services/menuItemService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import MenuItemsTable from "./menuItemsTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";

import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class MenuItems extends Component {
  state = {
    menu_items: [],
    menuItem: "",
    open: false,
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: menu_items } = await getMenuItems();
    this.setState({ menu_items, blocking: false });
  }

  handleDelete = menuItem => {
    this.setState({ open: true, menuItem });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  doDelete = async () => {
    const menuItem = this.state.menuItem;
    const originalMenuItems = this.state.menu_items;
    const menu_items = originalMenuItems.filter(o => o.id !== menuItem.id);
    this.setState({ menu_items });

    try {
      await deleteMenuItem(menuItem.id);
      this.setState({ open: false });

      toast.success("Menu item has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This menu item has already been deleted.");
      }

      this.setState({ menu_items: originalMenuItems, open: false });
    }
  };

  handleUpdate = menuItem => {
    return this.props.history.replace("/menu-items/" + menuItem.id + "/edit");
  };

  handleRecipeUpdate = menuItem => {
    return this.props.history.replace("/menu-items/" + menuItem.id + "/recipe");
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
      menu_items: allMenuItems,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allMenuItems.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allMenuItems;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const menu_items = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: menu_items };
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: menu_items } = this.getPagedData();
    const { length: count } = menu_items.length;
    if (count === 0) return <p>There are no menu items in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the menu item?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />
        <TableTitle title="Menu Items" icon="tag" />

        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{ paddingBottom: 0 }}>
                <SearchTextBox onSearchButtonClick={this.handleSearching} />
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Link to="/menu-items/new" className="ui primary button">
                  New Menu Item
                </Link>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <p>Showing {totalCount} menu items.</p>

        <MenuItemsTable
          menuItems={menu_items}
          sortColumn={sortColumn}
          onDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
          onRecipeUpdate={this.handleRecipeUpdate}
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

export default MenuItems;
