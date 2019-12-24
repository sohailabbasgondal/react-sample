import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getMenuType,
  updateMenuType,
  getMenuTypes
} from "../../services/menuTypeService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class MenuTypeEditForm extends Form {
  state = {
    data: {
      name: "",
      parent_id: ""
    },
    errors: {},
    menu_types: [],
    imagePreviewUrl: false,
    imageUrl: false
  };

  schema = {
    parent_id: Joi.number()
      .required()
      .label("Menu type"),
    name: Joi.string()
      .required()
      .label("Menu type name")
  };

  async populateStorageArea() {
    try {
      const menuTypeId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: menuType } = await getMenuType(menuTypeId);
      this.setState({
        data: this.mapToViewModel(menuType),
        imagePreviewUrl: menuType.thumbnail,
        blocking: false
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateStorageArea();

    const { data } = await getMenuTypes();
    const menu_types = [
      { id: "", name: "Select menu type" },
      { id: "0", name: "Root" },
      ...data
    ];
    this.setState({ menu_types });
  }

  mapToViewModel(menuType) {
    return {
      name: menuType.name,
      parent_id: menuType.parent === null ? "0" : menuType.parent.id
    };
  }

  createImage = file => {
    let reader = new FileReader();
    reader.onload = e => {
      this.setState({ imagePreviewUrl: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  onChangeFile = e => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.setState({ imageUrl: files[0] });
    this.createImage(files[0]);
  };

  doSubmit = async () => {
    try {
      const menuTypeId = this.props.match.params.id;

      let formData = new FormData();
      formData.append("name", this.state.data.name);
      formData.append("parent_id", this.state.data.parent_id);
      formData.append("thumbnail", this.state.imageUrl);
      formData.append("id", menuTypeId);
      formData.append("_method", "PUT");

      this.setState({ blocking: true });
      await updateMenuType(formData, menuTypeId);
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
                <Table.HeaderCell colSpan="2">Add menu type</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {this.renderSelect(
                    "parent_id",
                    "Parent type",
                    this.state.menu_types
                  )}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput("name", "Menu type", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <input
                    className="input_imagem_artigo"
                    type="file"
                    onChange={this.onChangeFile}
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="imgPreview">
                    {this.state.imagePreviewUrl ? (
                      <img
                        className="add_imagem"
                        name="add_imagem"
                        height="40"
                        src={
                          process.env.REACT_APP_BACKEND_URL +
                          "/storage/" +
                          this.state.imagePreviewUrl
                        }
                      />
                    ) : (
                      ""
                    )}
                  </div>
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
