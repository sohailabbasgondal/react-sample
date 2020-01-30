import React, { Component } from "react";
import { getSalary } from "../../services/salaryService";
import { Table, Grid, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Link } from "react-router-dom";
import TableTitle from "../common/tableTitle";

class SalaryDetail extends Component {
  state = {
    salary: [],
    blocking: false
  };

  async getSalaryDetail(salaryId) {
    try {
      const { data: salary } = await getSalary(salaryId);

      this.setState({ salary, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  componentDidMount() {
    this.setState({ blocking: true });
    const salaryId = this.props.match.params.id;
    this.getSalaryDetail(salaryId);
  }

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Salary detail" icon="tag" />

        <Grid columns={1} divided>
          <Grid.Row>
            <Grid.Column>
              <center>
                {/* <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={8}>Work Date</Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={8}></Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table> */}

                <Table celled fixed singleLine>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={4}>Name</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Mobile</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Company</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Hours</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.state.salary.map(entry => (
                      <Table.Row key={entry.id}>
                        <Table.Cell>{entry.visa.name}</Table.Cell>

                        <Table.Cell>{entry.visa.mobile}</Table.Cell>

                        <Table.Cell>{entry.visa.company.name}</Table.Cell>
                        <Table.Cell>{entry.hours}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </center>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </BlockUi>
    );
  }
}

export default SalaryDetail;
