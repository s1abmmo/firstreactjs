import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class Person extends React.Component {
 
  // Use the render function to return JSX component
  render() {
    return (
    <tr>
      <th>{this.props.id}</th>
      <th>>{this.props.username}</th>
      <th>{this.props.email}</th>
      <th>{this.props.phone}</th>
      <th>{this.props.fullname}</th>
      <th>{this.props.token}</th>
      <th>{this.props.balance}</th>
      <th>{this.props.datetimeCreated}</th>
    </tr>
      );
    }
}

function App() {
  fetch("").then(res => res.json())
  return (
    <div className="App">
      <header className="App-header">
        <div className="table">
          <thead> <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Fullname</th>
            <th>Token</th>
            <th>Balance</th>
            <th>Datetime Created</th>
          </tr>
          </thead>
          <tbody>
          <Person id='1' username='Bill' email='Gates' phone='0962' fullname='lhd' token='' balance='390' datetimeCreated='43243' />
            </tbody>
        </div>
      </header>
    </div>
  );
}

export default App;
