import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getMenuType, updateMenuType } from "../../services/menuTypeService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class MenuTypeEditForm extends Form {
  state = {
    data: {
      name: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .label("Menu type")
  };

  async populateStorageArea() {
    try {
      const menuTypeId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: menuType } = await getMenuType(menuTypeId);
      this.setState({
        data: this.mapToViewModel(menuType),
        blocking: false
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateStorageArea();
  }

  mapToViewModel(menuType) {
    return {
      name: menuType.name
    };
  }

  doSubmit = async () => {
    try {
      const menuTypeId = this.props.match.params.id;
      const data = { ...this.state.data };
      data.id = parseInt(menuTypeId);
      this.setState({ blocking: true });
      await updateMenuType(data);
      this.setState({ blocking: false });
      toast.success("Menu type has been updated successfully.");
      this.props.history.push("/menu-types");
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
        <TableTitle title="Update menu type" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Add menu type</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Menu type", "text")}
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

export default MenuTypeEditForm;
