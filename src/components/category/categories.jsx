import React, { Component } from "react";
import {
  getCategories,
  deleteCategory,
  updateCategoryStatus
} from "../../services/categoryService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import CategoriesTable from "./categoriesTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table, Confirm } from "semantic-ui-react";

class Categories extends Component {
  state = {
    categories: [],
    category: "",
    open: false,
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: ""
  };

  async componentDidMount() {
    this.setState({ blocking: true, show: "none" });
    const { data: categories } = await getCategories();
    this.checkTotalCategories(categories);
    this.state.blocking = false;
    this.setState({ categories, blocking: false });
  }

  checkTotalCategories = categories => {
    if (categories.length > 0) {
      this.setState({ show: "none" });
    } else {
      this.setState({ show: "block" });
    }
  };

  handleDelete = category => {
    this.setState({ open: true, category });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  doDelete = async () => {
    const category = this.state.category;
    const originalCategories = this.state.categories;
    const categories = originalCategories.filter(o => o.id !== category.id);
    this.setState({ categories });

    try {
      await deleteCategory(category.id);
      this.checkTotalCategories(categories);
      toast.success("Category has been updated successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This category has already been deleted.");
      }

      this.setState({ categories: originalCategories });
    }
  };

  handleUpdate = storgeArea => {
    return this.props.history.replace("/categories/" + storgeArea.id + "/edit");
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

  handleUpdateStatus = async category => {
    this.setState({ blocking: true });
    await updateCategoryStatus(category);
    const { data: categories } = await getCategories();

    this.setState({ blocking: false, categories });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      categories: allCategories,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allCategories.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allCategories;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const categories = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: categories };
  };

  render() {
    const emtpyUrl = process.env.REACT_APP_URL + "/empty1.png";
    const { pageSize, currentPage, sortColumn, show } = this.state;
    const { totalCount, data: categories } = this.getPagedData();

    const otherShow = show === "none" ? "block" : "none";

    if (this.state.categories.length === 0) {
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
                <p>Categories not added yet.</p>
                <Link to="/categories/new" className="ui primary button">
                  New Category
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
          content="Are you sure, you want to delete the category?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />

        <TableTitle title="Categories" icon="tag" />

        <div style={{ display: otherShow }}>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Link to="/categories/new" className="ui primary button">
                    New Category
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <p>Showing {totalCount} categories.</p>

          <CategoriesTable
            categories={categories}
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

export default Categories;
