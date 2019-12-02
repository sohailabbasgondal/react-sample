import React, { Component } from "react";
import { getOutlet } from "../../services/outletService";
import TableTitle from "../common/tableTitle";
import { Table, Button } from "semantic-ui-react";
import BlockUi from "react-block-ui";
class OutletDetails extends Component {
  state = {
    outlet: { user: {} }
  };

  async getOutletDetail() {
    try {
      this.setState({ blocking: true });
      const outletId = this.props.match.params.id;
      const { data: outlet } = await getOutlet(outletId);

      this.setState({ outlet, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.getOutletDetail();
    this.setState({ blocking: false });
  }

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Outlet detail" icon="tag" />

        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={2}>Outlet Name</Table.Cell>
              <Table.Cell>{this.state.outlet.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>City</Table.Cell>
              <Table.Cell>{this.state.outlet.city}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Address</Table.Cell>
              <Table.Cell>{this.state.outlet.address}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Zip</Table.Cell>
              <Table.Cell>{this.state.outlet.zip}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Phone</Table.Cell>
              <Table.Cell>{this.state.outlet.phone}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Emails</Table.Cell>
              <Table.Cell>{this.state.outlet.emails}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Manager Name</Table.Cell>
              <Table.Cell>{this.state.outlet.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Manager Email</Table.Cell>
              <Table.Cell>{this.state.outlet.email}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Button
          className="ui primary button"
          onClick={() => this.props.history.push("/outlets")}
        >
          Back
        </Button>
      </BlockUi>
    );
  }
}

export default OutletDetails;
