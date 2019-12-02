import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveCateogry } from "../../services/categoryService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class CategoryForm extends Form {
  state = {
    data: {
      name: "",
      description: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Category name"),
    description: Joi.string()
      .required()
      .label("Description")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveCateogry(this.state.data);
      toast.success("Category has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/categories");
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
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add category" icon="tag" />
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
                <Table.Cell>{this.renderButton("Save")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default CategoryForm;
