import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveStorageArea } from "../../services/storageAreaService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class StorageAreaForm extends Form {
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
      .label("Storage area name"),
    description: Joi.string()
      .required()
      .label("Description")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveStorageArea(this.state.data);
      this.setState({ blocking: false });
      toast.success("Storgae area has been added successfully.");
      this.props.history.push("/storage-areas");
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
        <TableTitle title="Add storage area" icon="tag" />
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
                  {this.renderInput("name", "Storage area name", "text")}
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

export default StorageAreaForm;
