import React from 'react';
import logo from './logo.svg';
import './App.css';

class Person extends React.Component {
  render() {
    let b = ".hide" + this.props.id;
    let a = "collapse hide" + this.props.id;
    return (
      <>
        <tr data-toggle="collapse" data-target={b}>
          <th scope="row">{this.props.id}</th>
          <th>{this.props.username}</th>
          <th>{this.props.email}</th>
          <th>{this.props.phone}</th>
          <th>{this.props.fullname}</th>
          <th>{this.props.balance}</th>
          <th>{this.props.datetimeCreated}</th>
          <th>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Action
  </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Active</a>
                <a class="dropdown-item" href="#">Banned</a>
                <a class="dropdown-item" href="#">Add balance</a>
                <a class="dropdown-item" href="#">Deduct balance</a>
              </div>
            </div>
          </th>
          <th>
            <button type="button" class="btn btn-dark">More</button>
          </th>
        </tr>
        <tr class={a}>
          <td colspan="10">
            <ul class="list-group">
              <li class="list-group-item">Status</li>
            </ul>
          </td>
        </tr>
      </>
    );
  }
}

class Menu extends React.Component {
  render() {
    return (
      <nav className="bg-light border-right">
        <div id="left-menu" className="list-group list-group-flush">
          <a className="list-group-item list-group-item-action bg-light">Users</a>
          <a className="list-group-item list-group-item-action bg-light">Market</a>
          <a className="list-group-item list-group-item-action bg-light">History</a>
        </div>
      </nav>
    );
  }
}

function handleClick(e) {
  e.preventDefault();
  alert("hello");
  console.log('The link was clicked.');
}

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("/users")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <tbody>
          {items.map(item => (
            <Person id={item.id} username={item.username} email={item.email} phone={item.phone} fullname={item.fullname} balance={item.balance} datetimeCreated={item.datetimeCreated} />
          ))}
        </tbody>
      );
    }
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Menu />
          </div>
          <div className="col-auto">
            <table className="table table-striped table-sm">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Fullname</th>
                  <th scope="col">Balance</th>
                  <th scope="col">Datetime Created</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <MyComponent/>
            </table>

          </div>
        </div>
      </div>

    );
  }
}

export default App;
