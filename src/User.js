import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';

function setUserPermission(userPermission, idUser, userName, adminId, adminName, adminCookie) {
    fetch("/setUserPermission?userPermission=" + userPermission + "&idUser=" + idUser + "&userName=" + userName + "&adminId=" + adminId + "&adminName=" + adminName + "&adminCookie=" + adminCookie)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    items: result.items
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


function addBalance(amout, idUser, userName, adminId, adminName, adminCookie) {
    fetch("/addBalance?amount=" + amout + "&idUser=" + idUser + "&userName=" + userName + "&adminId=" + adminId + "&adminName=" + adminName + "&adminCookie=" + adminCookie)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    items: result.items
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




class LoadUserTable extends React.Component {
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

class Pagination extends React.Component {
    render() {
        return (
            <nav aria-label="...">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled">
                        <span class="page-link">Previous</span>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item active" aria-current="page">
                        <span class="page-link">
                            2
          <span class="sr-only">(current)</span>
                        </span>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>);
    }
}




class UserTable extends React.Component {
    render() {
        return (
            <>
                <table className="table .table-bordered table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Full name</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Status</th>
                            <th scope="col">Last active</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <LoadUserTable />
                </table>
                <Pagination />
            </>
        );
    }
}

class AddMoneyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        addBalance(encodeURIComponent(this.state.value), this.props.id, this.props.username, this.props.adminId, this.props.adminName, this.props.adminToken)
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <input type="text" class="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Nhập số tiền cần thêm" />
                    </div>
                    <button type="submit" class="btn btn-primary">Xác nhận</button>
                </div>
            </form>
        );
    }
}


class DeductMoneyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        addBalance(encodeURIComponent("-" + this.state.value), this.props.id, this.props.username, this.props.adminId, this.props.adminName, this.props.adminToken)
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <input type="text" class="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Nhập số tiền cần trừ" />
                    </div>
                    <button type="submit" class="btn btn-primary">Xác nhận</button>
                </div>
            </form>
        );
    }
}

class Person extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
        console.log(this.state.adminId);
    }

    render() {
        let b = ".hide" + this.props.id;
        let a = "collapse hide" + this.props.id;
        let add = "collapse add" + this.props.id;
        let addt = ".add" + this.props.id;
        let deduct = "collapse deduct" + this.props.id;
        let deductt = ".deduct" + this.props.id;
        return (
            <>

                <tr>
                    <th scope="row">{this.props.id}</th>
                    <th>{this.props.username}</th>
                    <th>{this.props.email}</th>
                    <th>{this.props.phone}</th>
                    <th>{this.props.fullname}</th>
                    <th>{this.props.balance}</th>
                    <th>{this.props.status}</th>
                    <th>{this.props.lastactive}</th>
                    <th>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Action
    </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick={() => setUserPermission(1, this.props.id, this.props.username, this.state.adminId, this.state.adminName, this.state.adminToken)}>Active</a>
                                <a class="dropdown-item" href="#" onClick={() => setUserPermission(2, this.props.id, this.props.username, this.state.adminId, this.state.adminName, this.state.adminToken)}>Banned</a>
                                <a class="dropdown-item" href="#" data-toggle="collapse" data-target={addt}>Add balance</a>
                                <a class="dropdown-item" href="#" data-toggle="collapse" data-target={deductt}>Deduct balance</a>
                            </div>
                        </div>
                    </th>
                    <th>
                        <button type="button" class="btn btn-dark" data-toggle="collapse" data-target={b}>More</button>
                    </th>
                </tr>
                <tr class={a}>
                    <td colspan="10">
                        <ul>
                            <li>Time created:{this.props.datetimeCreated}</li>
                        </ul>
                    </td>
                </tr>
                <tr class={add}>
                    <td colspan="10">
                        <AddMoneyForm id={this.props.id} username={this.props.username} adminId={this.state.adminId} adminName={this.state.adminName} adminToken={this.state.adminToken} />
                    </td>
                </tr>
                <tr class={deduct}>
                    <td colspan="10">
                        <DeductMoneyForm id={this.props.id} username={this.props.username} adminId={this.state.adminId} adminName={this.state.adminName} adminToken={this.state.adminToken} />
                    </td>
                </tr>

            </>
        );
    }
}

export default UserTable;
