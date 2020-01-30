import React, { Component } from "react";
import Dashboard from "./components/dashboard";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./components/notfound";

import Navigation from "./components/common/navigation";
import LoginForm from "./components/loginForm";

import Companies from "./components/company/companies";
import CompanyForm from "./components/company/companyForm";
import CompanyEditForm from "./components/company/companyEditForm";
import CompanyEditManagerForm from "./components/company/companyManagerEditForm";

import RoomTypes from "./components/room_ledger_type/types";
import RoomTypeForm from "./components/room_ledger_type/typeForm";
import RoomTypeEditForm from "./components/room_ledger_type/typeEditForm";

import VehicleTypes from "./components/vehicle_ledger_type/types";
import VehicleTypeForm from "./components/vehicle_ledger_type/typeForm";
import VehicleTypeEditForm from "./components/vehicle_ledger_type/typeEditForm";

import VisaTypes from "./components/visa_ledger_type/types";
import VisaTypeForm from "./components/visa_ledger_type/typeForm";
import VisaTypeEditForm from "./components/visa_ledger_type/typeEditForm";

import YardTypes from "./components/yard_ledger_type/types";
import YardTypeForm from "./components/yard_ledger_type/typeForm";
import YardTypeEditForm from "./components/yard_ledger_type/typeEditForm";

import Rooms from "./components/room/rooms";
import RoomForm from "./components/room/form";
import RoomEditForm from "./components/room/editForm";
import RoomDetail from "./components/room/detail";
import RoomLedgerEditForm from "./components/room/editLedger";

import Vehicles from "./components/vehicle/vehicles";
import VehicleForm from "./components/vehicle/form";
import VehicleEditForm from "./components/vehicle/editForm";
import VehicleDetail from "./components/vehicle/detail";
import VehicleDocumentForm from "./components/vehicle/addDocument";
import VehicleDocumentEditForm from "./components/vehicle/editDocument";
import VehicleLedgerEditForm from "./components/vehicle/editLedger";

import Yards from "./components/yard/yards";
import YardForm from "./components/yard/form";
import YardEditForm from "./components/yard/editForm";
import YardDetail from "./components/yard/detail";
import YardLedgerEditForm from "./components/yard/editLedger";

import Visas from "./components/visa/visas";
import VisaForm from "./components/visa/form";
import VisaEditForm from "./components/visa/editForm";
import VisaDetail from "./components/visa/detail";
import VisaDocumentForm from "./components/visa/addDocument";
import VisaLedgerEditForm from "./components/visa/editLedger";
import VisaDocumentEditForm from "./components/visa/editDocument";

import Banks from "./components/bank/banks";
import BankForm from "./components/bank/form";
import BankEditForm from "./components/bank/editForm";

import CompanyDocuments from "./components/company_document/documents";
import CompanyDocumentForm from "./components/company_document/form";
import CompanyDocumentEditForm from "./components/company_document/editForm";

import Users from "./components/user/users";
import UserForm from "./components/user/userForm";
import UserEditForm from "./components/user/userEditForm";

import Salaries from "./components/salary/types";
import SalaryForm from "./components/salary/typeForm";
import SalaryEditForm from "./components/salary/typeEditForm";
import SalaryDetail from "./components/salary/detail";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-block-ui/style.css";
import "./App.css";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import { Container } from "semantic-ui-react";

class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        {user && <Navigation user={user} />}
        <ToastContainer />

        <Container style={{ marginTop: "6em", width: "96%" }}>
          <Switch>
            <ProtectedRoute
              path="/dashboard/:outlet"
              exact
              component={Dashboard}
            />
            <ProtectedRoute path="/dashboard" component={Dashboard} />

            <ProtectedRoute
              exact
              path="/yards-accounts/view/:id"
              component={YardDetail}
            />

            {/* salaries routes */}

            <ProtectedRoute
              exact
              path="/salaries/view/:id"
              component={SalaryDetail}
            />

            <ProtectedRoute exact path="/salaries/:id" component={SalaryForm} />
            <ProtectedRoute
              path="/salaries/:id/edit"
              component={SalaryEditForm}
            />
            <ProtectedRoute path="/salaries" component={Salaries} />

            {/* users routes */}
            <ProtectedRoute exact path="/users/:id" component={UserForm} />
            <ProtectedRoute path="/users/:id/edit" component={UserEditForm} />
            <ProtectedRoute path="/users" component={Users} />

            {/* company documents */}
            <ProtectedRoute
              exact
              path="/company-documents/:id"
              component={CompanyDocumentForm}
            />
            <ProtectedRoute
              exact
              path="/company-documents/:id/edit"
              component={CompanyDocumentEditForm}
            />
            <ProtectedRoute
              path="/company-documents"
              component={CompanyDocuments}
            />
            {/* banks accounts */}
            <ProtectedRoute
              exact
              path="/banks-accounts/:id"
              component={BankForm}
            />
            <ProtectedRoute
              path="/banks-accounts/:id/edit"
              component={BankEditForm}
            />
            <ProtectedRoute path="/banks-accounts" component={Banks} />
            {/* visas accounts */}

            <ProtectedRoute
              exact
              path="/visas-accounts/:id/document/new/"
              component={VisaDocumentForm}
            />

            <ProtectedRoute
              exact
              path="/visas-ledgers/:id/edit"
              component={VisaLedgerEditForm}
            />

            <ProtectedRoute
              exact
              path="/visas-documents/:id/edit"
              component={VisaDocumentEditForm}
            />

            <ProtectedRoute
              exact
              path="/visas-accounts/view/:id"
              component={VisaDetail}
            />

            <ProtectedRoute
              exact
              path="/visas-accounts/:id"
              component={VisaForm}
            />
            <ProtectedRoute
              exact
              path="/visas-accounts/:id/edit"
              component={VisaEditForm}
            />
            <ProtectedRoute path="/visas-accounts" component={Visas} />
            {/* yards accounts */}

            <ProtectedRoute
              exact
              path="/yards-ledgers/:id/edit"
              component={YardLedgerEditForm}
            />

            <ProtectedRoute
              exact
              path="/yards-accounts/:id"
              component={YardForm}
            />
            <ProtectedRoute
              path="/yards-accounts/:id/edit"
              component={YardEditForm}
            />
            <ProtectedRoute path="/yards-accounts" component={Yards} />
            {/* vehicles accounts */}

            <ProtectedRoute
              exact
              path="/vehicles-ledgers/:id/edit"
              component={VehicleLedgerEditForm}
            />

            <ProtectedRoute
              exact
              path="/vehicles-accounts/:id/document/new/"
              component={VehicleDocumentForm}
            />

            <ProtectedRoute
              exact
              path="/vehicles-documents/:id/edit"
              component={VehicleDocumentEditForm}
            />

            <ProtectedRoute
              exact
              path="/vehicles-accounts/view/:id"
              component={VehicleDetail}
            />

            <ProtectedRoute
              exact
              path="/vehicles-accounts/:id"
              component={VehicleForm}
            />
            <ProtectedRoute
              exact
              path="/vehicles-accounts/:id/edit"
              component={VehicleEditForm}
            />
            <ProtectedRoute path="/vehicles-accounts" component={Vehicles} />
            {/* rooms accounts */}

            <ProtectedRoute
              exact
              path="/rooms-ledgers/:id/edit"
              component={RoomLedgerEditForm}
            />

            <ProtectedRoute
              exact
              path="/rooms-accounts/view/:id"
              component={RoomDetail}
            />

            <ProtectedRoute
              exact
              path="/rooms-accounts/:id"
              component={RoomForm}
            />
            <ProtectedRoute
              path="/rooms-accounts/:id/edit"
              component={RoomEditForm}
            />
            <ProtectedRoute path="/rooms-accounts" component={Rooms} />
            {/* yards ledgers type routes */}

            <ProtectedRoute
              exact
              path="/yards-ledgers-types/:id"
              component={YardTypeForm}
            />
            <ProtectedRoute
              path="/yards-ledgers-types/:id/edit"
              component={YardTypeEditForm}
            />
            <ProtectedRoute path="/yards-ledgers-types" component={YardTypes} />
            {/* visas ledgers type routes */}
            <ProtectedRoute
              exact
              path="/visas-ledgers-types/:id"
              component={VisaTypeForm}
            />
            <ProtectedRoute
              path="/visas-ledgers-types/:id/edit"
              component={VisaTypeEditForm}
            />
            <ProtectedRoute path="/visas-ledgers-types" component={VisaTypes} />
            {/* vehicles ledgers type routes */}

            <ProtectedRoute
              exact
              path="/vehicles-ledgers-types/:id"
              component={VehicleTypeForm}
            />
            <ProtectedRoute
              path="/vehicles-ledgers-types/:id/edit"
              component={VehicleTypeEditForm}
            />
            <ProtectedRoute
              path="/vehicles-ledgers-types"
              component={VehicleTypes}
            />
            {/* rooms ledgers type routes */}
            <ProtectedRoute
              exact
              path="/rooms-ledgers-types/:id"
              component={RoomTypeForm}
            />
            <ProtectedRoute
              path="/rooms-ledgers-types/:id/edit"
              component={RoomTypeEditForm}
            />
            <ProtectedRoute path="/rooms-ledgers-types" component={RoomTypes} />
            {/* companies routes */}
            <ProtectedRoute
              exact
              path="/companies/:id/manager-edit/:uid"
              component={CompanyEditManagerForm}
            />
            <ProtectedRoute
              exact
              path="/companies/:id"
              component={CompanyForm}
            />
            <ProtectedRoute
              path="/companies/:id/edit"
              component={CompanyEditForm}
            />
            <ProtectedRoute path="/companies" component={Companies} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
