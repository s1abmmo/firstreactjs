import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import { createStore } from 'redux'
import CurrencyFormat from 'react-currency-format';

// var initialState = {
//     status: false,
//     objlist: []
// }
// function usertable(state = initialState, action, value) {
//     if (action.type === 'INPUT') {
//         let newState = { ...state }
//         newState.status = true;
//         newState.objlist = action.objectlist;
//         return newState;
//     } else if (action.type === 'RECEIVED') {
//         let newState = { ...state }
//         newState.status = false;
//         return newState;
//     }
//     return state.objlist;
// }

function counter(state = { value: 1, status: false }, action, value) {
    switch (action.type) {
        case 'VALUE':
            return state = { value: action.value, status: true };
        case 'TRUE':
            return state = { value: state.value, status: true };
        case 'FALSE':
            return state = { value: state.value, status: false };
        default:
            return state
    }
}

let store = createStore(counter);
// let store1 = createStore(usertable);

function setUserPermission(userPermission, idUser, userName, adminId, adminName, adminToken) {
    fetch("/setUserPermission?userPermission=" + userPermission + "&idUser=" + idUser + "&userName=" + userName + "&adminId=" + adminId + "&adminName=" + adminName + "&adminToken=" + adminToken)
        .then(res => res.json())
        .then(
            (result) => {
                store.dispatch({ type: 'TRUE' });
                console.log(store.getState());
            },
            (error) => {
                console.log(error.message);
            }
        )
}


function addBalance(amout, idUser, userName, adminId, adminName, adminToken) {
    fetch("/addBalance?amount=" + amout + "&idUser=" + idUser + "&userName=" + userName + "&adminId=" + adminId + "&adminName=" + adminName + "&adminToken=" + adminToken)
        .then(res => res.json())
        .then(
            (result) => {
                store.dispatch({ type: 'TRUE' });
                console.log(store.getState());
            },
            (error) => {
                console.log(error.message);
            }
        )
}




class LoadUserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            currentPage: 1,
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
    }

    componentDidMount() {
        fetch("/users?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&page=" + this.state.currentPage)
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
        store.subscribe(() => {
            if (store.getState().status == true) {
                var cpage = store.getState();
                store.dispatch({ type: 'FALSE', value: null });
                console.log("da nhan " + cpage.value)
                this.setState({
                    currentPage: cpage.value
                })
                fetch("/users?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&page=" + cpage.value)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                isLoaded: true,
                                items: result
                            });
                        },
                        (error) => {
                            this.setState({
                                isLoaded: true,
                                error
                            });
                        }
                    )

            }
        }
        );
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <tbody>
                    {items.map(item => (
                        <Person id={item.id} username={item.username} email={item.email} phone={item.phone} fullname={item.fullname} balance={item.balance} status={item.status} datetimeCreated={item.datetimeCreated} />
                    ))}
                </tbody>
            );
        }
    }
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxPage: 0,
            currentGroupPage: 0,
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
        this.PreviousPage = this.PreviousPage.bind(this);
        this.NextPage = this.NextPage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    PreviousPage() {
        this.setState({
            currentGroupPage: this.state.currentGroupPage - 1
        })
    }
    NextPage() {
        this.setState({
            currentGroupPage: this.state.currentGroupPage + 1
        })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        console.log(name);
        store.dispatch({ type: 'VALUE', value: name });
    }

    componentDidMount() {
        fetch("/usersCountPage?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status == "OK") {
                        this.setState({
                            maxPage: result.pageCount
                        });
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
        var maxGroupPage = this.state.maxPage / 5;
        console.log(this.state.currentGroupPage + "_" + maxGroupPage);
        var indents = [];
        if (this.state.currentGroupPage > 0)
            indents.push(<li class="page-item"><a class="page-link" href="#" onClick={this.PreviousPage}>Previous</a></li>);
        for (var i = 1; i <= 5; i++) {
            var iexport = i + this.state.currentGroupPage * 5;
            if (iexport <= this.state.maxPage)
                indents.push(<li class="page-item"><a class="page-link" href="#" name={iexport} onClick={this.handleChange}>{iexport}</a></li>);
        }
        if (this.state.currentGroupPage < maxGroupPage - 1)
            indents.push(<li class="page-item"><a class="page-link" href="#" onClick={this.NextPage}>Next</a></li>);
        return (
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-center">
                    {indents}
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
        let propstatus= this.props.status=="0" ? "Not actived" : "";
        propstatus= this.props.status=="1" ? "Actived" : propstatus;
        propstatus= this.props.status=="2" ? "Banned" : propstatus;
        return (
            <>

                <tr>
                    <th scope="row">{this.props.id}</th>
                    <th>{this.props.username}</th>
                    <th>{this.props.email}</th>
                    <th>{this.props.phone}</th>
                    <th>{this.props.fullname}</th>
                    <th><CurrencyFormat value={this.props.balance} displayType={'text'} thousandSeparator={true} /></th>
                    <th>{propstatus}</th>
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
