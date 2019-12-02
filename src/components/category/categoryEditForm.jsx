import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getCategory, updateCategory } from "../../services/categoryService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class CategoryEditForm extends Form {
  state = {
    data: {
      name: "",
      description: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .label("Category area name"),
    description: Joi.string()
      .required()
      .label("Description")
  };

  async populateCategory() {
    try {
      this.setState({ blocking: true });
      const storageAreaId = this.props.match.params.id;
      const { data: storageArea } = await getCategory(storageAreaId);
      this.setState({
        data: this.mapToViewModel(storageArea),
        blocking: false
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateCategory();
  }

  mapToViewModel(storageArea) {
    return {
      name: storageArea.name,
      description: storageArea.description
    };
  }

  doSubmit = async () => {
    try {
      const categoryId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(categoryId);
      this.setState({ blocking: true });
      await updateCategory(data);
      toast.success("Category has been updated successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/categories");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update category" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">
                  Add storage area
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Category name", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("description", "Description", "text")}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>{this.renderButton("Update")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default CategoryEditForm;
