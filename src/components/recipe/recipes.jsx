import React, { Component } from "react";
import {
  getServings,
  deleteServing,
  saveServing
} from "../../services/recipeService";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import SearchTextBox from "../common/searchTextBox";
import Form from "../common/form";
import RecipesTable from "./recipesTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table, Confirm, Modal, Button } from "semantic-ui-react";
import Joi from "joi-browser";

import { getItems } from "../../services/itemService";

class Recipes extends Form {
  state = {
    recipes: [],
    recipe: "",
    open_confirm: false,
    open: false,
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "title", order: "asc" },
    noRecordFound: "",
    data: {
      item_id: "",
      serving: ""
    },
    items: [],
    errors: {}
  };

  schema = {
    id: Joi.string(),
    item_id: Joi.number()
      .required()
      .label("Item"),
    serving: Joi.string()
      .required()
      .label("Serving")
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: recipes } = await getServings(this.props.match.params.id);

    const { data: itms } = await getItems();
    const items = [{ id: "", name: "All items" }, ...itms];

    this.setState({ items, recipes, blocking: false });
  }

  handleDelete = recipe => {
    this.setState({ open_confirm: true, recipe });
  };

  handleCancel = () => {
    this.setState({ open_confirm: false });
  };

  doDelete = async () => {
    const itemId = this.props.match.params.id;
    const recipe = this.state.recipe;

    const originalRecipes = this.state.recipes;
    const recipes = originalRecipes.filter(o => o.id !== recipe.id);
    this.setState({ recipes, open_confirm: false });

    try {
      await deleteServing(itemId, recipe.id);
      toast.success("Serving has been updated successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This serving has already been deleted.");
      }

      this.setState({ recipes: originalRecipes });
    }
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
      recipes: allRecipes,
      keyFieldValue,
      sortColumn
    } = this.state;

    const filtered = keyFieldValue
      ? allRecipes.filter(
          m => m.name.toUpperCase().indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : allRecipes;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const recipes = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: recipes };
  };

  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });

      const itemId = this.props.match.params.id;
      const data = { ...this.state.data };
      data.menu_item_id = parseInt(itemId);

      await saveServing(data);
      this.componentDidMount();

      this.setState({
        blocking: false,
        open: false,
        data: { item_id: "", serving: "" }
      });
      toast.success("Serving has been added successfully.");

      //this.props.history.push("/menu-items/" + data.menu_item_id + "/recipe");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };
        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;
        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };
  render() {
    const { open, size, pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: recipes } = this.getPagedData();
    const { length: count } = recipes.length;
    if (count === 0) return <p>There are no recipes in the store.</p>;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Modal size={size} open={open} onClose={this.close} closeIcon>
          <Modal.Content>
            <form onSubmit={this.handleSubmit} className="ui error form">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="2">Add serving</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell colSpan="2">
                      {this.renderSelect("item_id", "Item", this.state.items)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell colSpan="2">
                      {this.renderInput("serving", "Serving", "text")}
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>{this.renderButton("Save")}</Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </form>
          </Modal.Content>
        </Modal>

        <Confirm
          open={this.state.open_confirm}
          header="Confirmation"
          content="Are you sure, you want to delete the serving?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />

        <TableTitle title="Setup servings" icon="tag" />

        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell style={{ paddingBottom: 0 }}>
                <SearchTextBox onSearchButtonClick={this.handleSearching} />
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Button
                  className="ui primary button"
                  onClick={this.show("tiny")}
                >
                  New serving
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <p>Showing {totalCount} servings.</p>

        <RecipesTable
          recipes={recipes}
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

export default Recipes;
