import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Image, Menu, Dropdown } from "semantic-ui-react";

const Navigation = ({ user }) => {
  const logoUrl = process.env.REACT_APP_URL + "/logo.jpg";
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <Image
            src={logoUrl}
            style={{ marginRight: "1.5em", height: "30px" }}
          />
        </Menu.Item>
        <Menu.Item>
          <NavLink className="nav-item nav-link" to="/dashboard">
            Dashboard
          </NavLink>
        </Menu.Item>

        {user && user.role === "client" && (
          <Menu.Item>
            <NavLink className="nav-item nav-link" to="/companies">
              Companies
            </NavLink>
          </Menu.Item>
        )}

        {user && user.role === "salary-admin" && (
          <Menu.Item>
            <NavLink className="nav-item nav-link" to="/salaries">
              Salaries
            </NavLink>
          </Menu.Item>
        )}

        {user && (user.role === "company" || user.role === "admin") && (
          <React.Fragment>
            <Dropdown item simple text="Rooms">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/rooms-ledgers-types">
                    Ledger Types
                  </NavLink>
                </Dropdown.Item>
                {/* <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/rooms-ledgers">
                    Ledgers
                  </NavLink>
                </Dropdown.Item> */}
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/rooms-accounts">
                    Accounts
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown item simple text="Vehicles">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink
                    style={{ color: "#000" }}
                    to="/vehicles-ledgers-types"
                  >
                    Ledger Types
                  </NavLink>
                </Dropdown.Item>
                {/* <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/vehicles-ledgers">
                    Ledgers
                  </NavLink>
                </Dropdown.Item> */}
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/vehicles-accounts">
                    Accounts
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown item simple text="Visas">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/visas-ledgers-types">
                    Ledger Types
                  </NavLink>
                </Dropdown.Item>
                {/* <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/visas-ledgers">
                    Ledgers
                  </NavLink>
                </Dropdown.Item> */}
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/visas-accounts">
                    Accounts
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown item simple text="Yards">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/yards-ledgers-types">
                    Ledger Types
                  </NavLink>
                </Dropdown.Item>
                {/* <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/yards-ledgers">
                    Ledgers
                  </NavLink>
                </Dropdown.Item> */}
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/yards-accounts">
                    Accounts
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown item simple text="More">
              <Dropdown.Menu>
                {user.role === "company" && (
                  <Dropdown.Item>
                    <NavLink
                      style={{ color: "#000" }}
                      className="nav-item nav-link"
                      to="/users"
                    >
                      Users
                    </NavLink>
                  </Dropdown.Item>
                )}
                <Dropdown.Item>
                  <NavLink
                    style={{ color: "#000" }}
                    className="nav-item nav-link"
                    to="/banks-accounts"
                  >
                    Bank Details
                  </NavLink>
                </Dropdown.Item>

                <Dropdown.Item>
                  <NavLink
                    style={{ color: "#000" }}
                    className="nav-item nav-link"
                    to="/company-documents"
                  >
                    Documents
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </React.Fragment>
        )}
        {user && (
          <Menu.Menu position="right">
            <Menu.Item>
              <NavLink to="#">{`Welcome, ${user.name}`}</NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/logout">Logout</NavLink>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Container>
    </Menu>
  );
};

export default Navigation;
