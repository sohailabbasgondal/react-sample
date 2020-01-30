import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSalary, getVisas, verifyDate } from "../../services/salaryService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table, Button, Message } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import auth from "../../services/authService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class SalaryForm extends Component {
  state = {
    salaryDate: new Date(),
    visas: [],
    showSalaryForm: false,
    showError: false
  };

  handleChangeSalaryDate = date => {
    this.setState({
      salaryDate: date
    });
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: visas } = await getVisas();

    this.setState({ blocking: false, visas });
  }

  doSubmit = async () => {
    try {
      var event = new Date(this.state.salaryDate);
      let date = JSON.stringify(event);
      date = date.slice(1, 11);
      this.setState({ blocking: true });
      const verifyData = { date: date };
      const res = await verifyDate(verifyData);
      if (res.data.proceed == "no") {
        this.setState({ showError: true, blocking: false });
      } else {
        this.setState({
          showError: false,
          showSalaryForm: true,
          blocking: false
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  confirmSalary = async visaId => {
    this.setState({ blocking: true });
    const hour = document.getElementById(visaId).value;

    var event = new Date(this.state.salaryDate);
    let date = JSON.stringify(event);
    date = date.slice(1, 11);

    const verifyData = { visaId: visaId, hour: hour, salary_date: date };
    try {
      await saveSalary(verifyData);
      toast.success("Entry has been updated successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        toast.warning("Hours should be only numbers");
      }
    }

    this.setState({ blocking: false });
  };

  render() {
    if (auth.getCurrentUser().role != "salary-admin") {
      return "Your are authorized to perform this action.";
    }
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add salary" icon="tag" />
        <center>
          <div className="ui error form" style={{ width: "30%" }}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">Add salary</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row width="16">
                  <Table.Cell style={{ textAlign: "right" }}>
                    <b>Select Date</b>
                  </Table.Cell>
                  <Table.Cell>
                    <DatePicker
                      selected={this.state.salaryDate}
                      onChange={this.handleChangeSalaryDate}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row width="16">
                  <Table.Cell colSpan="2">
                    <center>
                      <Button color="green" onClick={this.doSubmit}>
                        Submit
                      </Button>
                    </center>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Message
              negative
              style={{
                display: this.state.showError == true ? "block" : "none"
              }}
            >
              <Message.Header>Error</Message.Header>
              <p>Date is not valid or salary already entered.</p>
            </Message>
          </div>

          <div
            className="ui error form"
            style={{
              width: "70%",
              marginTop: "20px",
              display: this.state.showSalaryForm == true ? "block" : "none"
            }}
          >
            <Table celled fixed singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={4}>Name</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Mobile</Table.HeaderCell>
                  <Table.HeaderCell width={5}>Company</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Hours</Table.HeaderCell>
                  <Table.HeaderCell width={2}></Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.visas.map(visa => (
                  <Table.Row key={visa.id}>
                    <Table.Cell>{visa.name}</Table.Cell>
                    <Table.Cell>{visa.mobile}</Table.Cell>
                    <Table.Cell>{visa.company}</Table.Cell>
                    <Table.Cell>
                      <input maxlength="2" type="text" id={visa.id} />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="green"
                        onClick={() => this.confirmSalary(visa.id)}
                      >
                        Confirm
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </center>
      </BlockUi>
    );
  }
}

export default SalaryForm;
