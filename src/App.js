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
      content: <UserTable />
    };
    this.Users = this.Users.bind(this);
  }
  Users() {
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
                <a className="list-group-item list-group-item-action bg-dark text-light" onClick={this.Users}>Users</a>
                <a className="list-group-item list-group-item-action bg-light">Các chuyến xe</a>
                <a className="list-group-item list-group-item-action bg-light">Xe</a>
                <a className="list-group-item list-group-item-action bg-light">Lịch sử</a>
                <a className="list-group-item list-group-item-action bg-light">History</a>
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
            content:<UserPage/>
          });
          if (result.status == "OK") {
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
