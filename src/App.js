import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import UserTable from './User';

class Menu extends React.Component {
  render() {
      return (
          <div className="col-2">
              <nav className="bg-light border-right">
                  <div className="list-group list-group-flush">
                      <a className="list-group-item list-group-item-action bg-dark text-light">Tài xế</a>
                      <a className="list-group-item list-group-item-action bg-light">Các chuyến xe</a>
                      <a className="list-group-item list-group-item-action bg-light">Xe</a>
                      <a className="list-group-item list-group-item-action bg-light">Lịch sử</a>
                      <a className="list-group-item list-group-item-action bg-light">History</a>
                  </div>
              </nav>
          </div>
      );
  }
}

class UserPage extends React.Component {
  render() {
      return (
          <div className="container-fluid">
              <div className="row">
                  <Menu />
                  <div className="col-auto">
                      <UserTable />
                  </div>
              </div>
          </div>
      );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    Cookies.set('adminId', 'Pacmian1', { path: '/' });
    Cookies.set('adminName', 'Pacman2', { path: '/' });
    Cookies.set('adminToken', 'Pacman3', { path: '/' });
}
  render() {
    return(
      <UserPage />
    );
  }
}

export default Main;
