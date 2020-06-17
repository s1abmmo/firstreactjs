import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import UserTable from './User';
import SigninPage from './SigninPage';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: <UserTable />,
      indexClass:0
    };
    this.Users = this.Users.bind(this);
    this.Market = this.Market.bind(this);
    this.Cars = this.Cars.bind(this);
    this.History = this.History.bind(this);
    this.CreateAccount = this.CreateAccount.bind(this);
    this.Logout = this.Logout.bind(this);
  }
  Users() {
    this.state.indexClass=0;
    this.setState({
      content: <UserTable />
    })
  }
  Market() {
    this.state.indexClass=1;
    this.setState({
      content: <UserTable />
    })
  }
  Cars() {
    this.state.indexClass=2;
    this.setState({
      content: <UserTable />
    })
  }
  History() {
    this.state.indexClass=3;
    this.setState({
      content: <UserTable />
    })
  }
  CreateAccount() {
    this.state.indexClass=4;
    this.setState({
      content: <UserTable />
    })
  }
  Logout() {
    this.state.indexClass=5;
    this.setState({
      content: <UserTable />
    })
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <nav className="bg-light border-right">
              <div className="list-group list-group-flush">
                <a className={this.state.indexClass==0 ? "list-group-item list-group-item-action bg-dark text-light" : "list-group-item list-group-item-action bg-light"} onClick={this.Users}>Users</a>
                <a className={this.state.indexClass==1 ? "list-group-item list-group-item-action bg-dark text-light" : "list-group-item list-group-item-action bg-light"} onClick={this.Market}>Market</a>
                <a className={this.state.indexClass==2 ? "list-group-item list-group-item-action bg-dark text-light" : "list-group-item list-group-item-action bg-light"} onClick={this.Cars}>Car</a>
                <a className={this.state.indexClass==3 ? "list-group-item list-group-item-action bg-dark text-light" : "list-group-item list-group-item-action bg-light"} onClick={this.History}>History</a>
                <a className={this.state.indexClass==4 ? "list-group-item list-group-item-action bg-dark text-light" : "list-group-item list-group-item-action bg-light"} onClick={this.CreateAccount}>Create Account</a>
                <a className={this.state.indexClass==5 ? "list-group-item list-group-item-action bg-dark text-light" : "list-group-item list-group-item-action bg-light"} onClick={this.Logout}>Logout</a>
              </div>
            </nav>
          </div>

          <div className="col-auto">
            {this.state.content}
          </div>
        </div>
      </div>
    );
  }
}

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: <SigninPage />,
      items: [],
      adminId: Cookies.get('adminId'),
      adminName: Cookies.get('adminName'),
      adminToken: Cookies.get('adminToken'),
    };
  }
  componentDidMount() {
    fetch("/checkAdminToken?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result,
          });
          if (result.status == "OK") {
            this.setState({
              content:<UserPage/>
            });  
            Cookies.set('permissionActive', result.permissionActive, { path: '/' });
            Cookies.set('permissionBanned', result.permissionBanned, { path: '/' });
            Cookies.set('permissionAddMoney', result.permissionAddMoney, { path: '/' });
            Cookies.set('permissionDeductMoney', result.permissionDeductMoney, { path: '/' });
            Cookies.set('permissionApproveTrip', result.permissionApproveTrip, { path: '/' });
            Cookies.set('permissionCancelTrip', result.permissionCancelTrip, { path: '/' });
            Cookies.set('permissionSuspendTrip', result.permissionSuspendTrip, { path: '/' });
            Cookies.set('permissionEditTrip', result.permissionEditTrip, { path: '/' });
            Cookies.set('permissionApproveCar', result.permissionApproveCar, { path: '/' });
            Cookies.set('permissionSuspendCar', result.permissionSuspendCar, { path: '/' });
        }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )

  }
  render() {
    return (
      <>   {this.state.content}
      </>
    );
  }
}
