import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


var objList=[
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  },
    { "id": 1, "username": "Apples",  "email": "$2",  "phone": "$2",  "email": "$2",  "fullname": "$2",  "token": "$2" ,  "balance": "$2" ,  "datetimeCreated": "$2"  }
  ];

class Person extends React.Component {
 
  // Use the render function to return JSX component
  render() {
    return (
    <tr>
      <th>{this.props.id}</th>
      <th>{this.props.username}</th>
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

class Menu extends React.Component {
  render() {
    return (
      <div id="left-menu">
      <ul className="list-group">
      <li className="list-group-item">Users</li>
      <li className="list-group-item">Market</li>
      <li className="list-group-item">History</li>
    </ul>
    </div>
      );
    }
}

function App() {
  fetch("").then(res => res.json())
  return (
    <div>
      <Menu />
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
          {objList.map(item => (
            <Person id={item.id} username={item.username} email={item.email} phone={item.phone} fullname={item.fullname} token={item.token} balance={item.balance} datetimeCreated={item.datetimeCreated} />          ))}
            </tbody>
        </div>
        </div>
  );
}

export default App;
