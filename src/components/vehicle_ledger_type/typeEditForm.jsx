import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getLedgerType,
  updateLedgerType
} from "../../services/vehicleLedgerTypeService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import auth from "../../services/authService";
import { Link } from "react-router-dom";

class VehicleTypeEditForm extends Form {
  state = {
    data: {
      name: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .label("Ledger type")
  };

  async populateLedgerType() {
    try {
      const ledgerTypeId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: ledgerType } = await getLedgerType(ledgerTypeId);

      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(ledgerType) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateLedgerType();
  }

  mapToViewModel(ledgerType) {
    return {
      name: ledgerType.name
    };
  }

  doSubmit = async () => {
    try {
      const ledgerTypeId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(ledgerTypeId);
      this.setState({ blocking: true });
      await updateLedgerType(data);
      this.setState({ blocking: false });
      toast.success("Ledger type has been updated successfully.");
      this.props.history.push("/vehicles-ledgers-types");
    } catch (ex) {
      console.log(ex.response);
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
    if (auth.getCurrentUser().role != "company") {
      return "Your are authorized to perform this action.";
    }

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update vehicle ledger type" icon="tag" />
        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "50%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">
                    Update ledger type
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row width="8">
                  <Table.Cell>
                    {this.renderInput("name", "Ledger type", "text")}
                  </Table.Cell>
                  <Table.Cell width="8"></Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Update")}
                    <Link
                      to="/vehicles-ledgers-types"
                      className="ui secondary button"
                    >
                      Back
                    </Link>
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </form>
        </center>
      </BlockUi>
    );
  }
}

export default VehicleTypeEditForm;
