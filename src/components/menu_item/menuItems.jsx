import React, { Component } from "react";
import {
  getMenuItems,
  deleteMenuItem,
  updateMenuItemStatus
} from "../../services/menuItemService";
import { getMenuTypes } from "../../services/menuTypeService";
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
import Input from "../common/input";
import Select from "../common/select";

class MenuItems extends Component {
  state = {
    menu_items: [],
    menu_types_dd: [],
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

    const { data: menu_types } = await getMenuTypes();

    const mt = [{ id: "", name: "All menu types" }];
    for (const [index, value] of menu_types.entries()) {
      mt.push({ id: value.id, name: value.name });
    }

    this.setState({ menu_items, blocking: false, menu_types_dd: mt });
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

  handleSearching = (keyword, menu_type_id) => {
    this.setState({ keyFieldValue: keyword, menu_type_id, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  clearFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("menu_type_id").value = "";

    document.getElementById("searcBtn").click();
  }

  handleUpdateStatus = async menuItem => {
    this.setState({ blocking: true });
    await updateMenuItemStatus(menuItem);
    const { data: menu_items } = await getMenuItems();

    this.setState({ blocking: false, menu_items });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      menu_items: allMenuItems,
      keyFieldValue,
      sortColumn,
      menu_type_id
    } = this.state;

    let filtered = keyFieldValue
      ? allMenuItems.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allMenuItems;

    filtered = menu_type_id
      ? filtered.filter(m => m.menu_type_id == menu_type_id)
      : filtered;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const menu_items = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: menu_items };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: menu_items } = this.getPagedData();
    const { length: count } = menu_items.length;

    if (this.state.menu_items.length === 0) {
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
                <p>Menu items not added yet.</p>
                <Link to="/menu-items/new" className="ui primary button">
                  New menu item
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
                <Table
                  style={{
                    border: "0px",
                    marginBottom: "6px",
                    marginLeft: "-4px",
                    marginRight: "-4px"
                  }}
                >
                  <Table.Body className="ui form">
                    <Table.Row>
                      <Table.Cell>
                        <Input
                          id="keyword"
                          name="keyword"
                          style={{ width: "100%" }}
                          placeholder="Search by keyword"
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <Select
                          name="menu_type_id"
                          id="menu_type_id"
                          options={this.state.menu_types_dd}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <button
                          onClick={() =>
                            this.handleSearching(
                              document.getElementById("keyword").value,
                              document.getElementById("menu_type_id").value
                            )
                          }
                          id="searcBtn"
                          className="ui primary button"
                          type="button"
                        >
                          Search
                        </button>
                        &nbsp;
                        <button
                          onClick={() => this.clearFilters()}
                          className="ui secondary button"
                          type="button"
                        >
                          Reset
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
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
          onStatusUpdate={this.handleUpdateStatus}
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
