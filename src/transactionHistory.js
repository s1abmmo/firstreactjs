import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';
import { createStore } from 'redux'

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


export default class TransactionHistory extends React.Component {
    render() {
        return (
            <>
                <table className="table .table-bordered table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">transactionId</th>
                            <th scope="col">transactionAmout</th>
                            <th scope="col">transactionNote</th>
                            <th scope="col">transactionDateTime</th>
                            <th scope="col">accountId</th>
                        </tr>
                    </thead>
                    <LoadTransactionHistory />
                </table>
                <Pagination />
            </>
        );
    }
}

class LoadTransactionHistory extends React.Component {
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
        var params={
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            page: this.state.currentPage
        }        
        axios.post("/adminLoadTransactionHistory", params)
            .then(res => {
                this.setState({
                    isLoaded: true,
                    items: res.data
                });
            })
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
                        <Transaction transactionId={item.transactionId} transactionAmout={item.transactionAmout} transactionNote={item.transactionNote} transactionDateTime={item.transactionDateTime} accountId={item.accountId}/>
                    ))}
                </tbody>
            );
        }
    }
}

class Transaction extends React.Component {
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
    }
    render() {
        return (
            <>
                <tr>
                    <th scope="row">{this.props.transactionId}</th>
                    <th>{this.props.transactionAmout}</th>
                    <th>{this.props.transactionNote}</th>
                    <th>{this.props.transactionDateTime}</th>
                    <th>{this.props.accountId}</th>
                </tr>
            </>
        );
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

