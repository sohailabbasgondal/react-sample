import React, { Component } from "react";
import auth from "../../services/authService";
import { Table } from "semantic-ui-react";
import Currency from "../common/currency";
class Printing extends Component {
  render() {
    return (
      <table>
        <thead></thead>
        <tbody style={{ fontSize: "11px" }}>
          <tr>
            <td style={{ paddingLeft: "70px" }}>
              <img
                width="100"
                src={
                  process.env.REACT_APP_BACKEND_URL +
                  "/storage/" +
                  auth.getCurrentUser().outlet.logo
                }
              />
            </td>
          </tr>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td>
              <b>{auth.getCurrentUser().outlet.name}</b>
            </td>
          </tr>
          <tr>
            <td>{auth.getCurrentUser().outlet.address},</td>
          </tr>
          <tr>
            <td>
              {auth.getCurrentUser().outlet.state},
              {auth.getCurrentUser().outlet.city} ,
            </td>
          </tr>
          <tr>
            <td>{auth.getCurrentUser().outlet.zip}</td>
          </tr>
          <tr>
            <td>
              <table style={{ fontSize: "10px" }}>
                <thead></thead>
                <tbody>
                  <tr>
                    <td style={{ width: "60%" }}>Name</td>
                    <td style={{ width: "10%" }}>Qty</td>
                    <td style={{ width: "10%" }}>Price</td>
                    <td style={{ width: "10%" }}>Total</td>
                  </tr>
                  {this.props.order.map(item => (
                    <tr>
                      <td>{item.title}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                      <td>{Number(item.price * item.qty)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4">
                      <hr size="1" />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">Sub Total</td>
                    <td colSpan="2">
                      <Currency label="" />
                      {this.props.total}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">Tax</td>
                    <td colSpan="2">
                      <Currency label="" />
                      {this.props.tax}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">Total</td>
                    <td colSpan="2">
                      <Currency label="" />
                      {this.props.grand}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <hr size="1" />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">Than you, visit again.</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Printing;
