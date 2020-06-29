import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import { createStore } from 'redux'
import CurrencyFormat from 'react-currency-format';
import axios from 'axios';

var initialState = {
    status: null,
    message: null,
    received: true
}

function statusmarket(state = initialState, action) {
    if (action.type === 'INPUT') {
        let newState = state;
        newState.status = action.status;
        newState.message = action.message;
        newState.received = false;
        return newState;
    } else if (action.type === 'RECEIVED') {
        let newState = state;
        newState.received = true;
        return newState;
    }
    return state;
}

let store = createStore(statusmarket);

class Alert extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.status == "OK") {
            return (
                <div class="alert alert-success" role="alert">
                    {this.props.message}
                </div>
            );
        } else if (this.props.status == "ERROR") {
            return (<>
                <div class="alert alert-danger" role="alert">
                    {this.props.message}
                </div>
            </>);
        } else {
            return (<></>);
        }
    }
}

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            superAdminId: Cookies.get('adminId'),
            superAdminName: Cookies.get('adminName'),
            superAdminToken: Cookies.get('adminToken'),
            permissionActive: this.props.permissionActive == "true",
            permissionBanned: this.props.permissionBanned == "true",
            permissionAddMoney: this.props.permissionAddMoney == "true",
            permissionDeductMoney: this.props.permissionDeductMoney == "true",
            permissionApproveTrip: this.props.permissionApproveTrip == "true",
            permissionCancelTrip: this.props.permissionCancelTrip == "true",
            permissionCancelTrip: this.props.permissionCancelTrip == "true",
            permissionSuspendTrip: this.props.permissionSuspendTrip == "true",
            permissionEditTrip: this.props.permissionEditTrip == "true",
            permissionApproveCar: this.props.permissionApproveCar == "true",
            permissionSuspendCar: this.props.permissionSuspendCar == "true"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let IsChecked = target.checked;
        console.log(IsChecked)
        this.setState({
            [name]: IsChecked
        });
    }

    handleClick(event) {
        var params = {
            superAdminId: this.state.superAdminId,
            superAdminName: this.state.superAdminName,
            superAdminToken: this.state.superAdminToken,
            adminId: this.props.adminId,
            adminName: this.props.adminName,
            permissionActive: this.state.permissionActive,
            permissionBanned: this.state.permissionBanned,
            permissionAddMoney: this.state.permissionAddMoney,
            permissionDeductMoney: this.state.permissionDeductMoney,
            permissionApproveTrip: this.state.permissionApproveTrip,
            permissionCancelTrip: this.state.permissionCancelTrip,
            permissionCancelTrip: this.state.permissionCancelTrip,
            permissionSuspendTrip: this.state.permissionSuspendTrip,
            permissionEditTrip: this.state.permissionEditTrip,
            permissionApproveCar: this.state.permissionApproveCar,
            permissionSuspendCar: this.state.permissionSuspendCar
        };
        axios.post("/editAdminPermission", params)
            .then(res => {
                store.dispatch({ type: 'INPUT', status: res.data.status, message: this.props.adminName+" "+res.data.message });
            })
    }

    render() {
        return (
            <>

                <tr>
                    <th scope="row">{this.props.adminId}</th>
                    <th>{this.props.adminName}</th>
                    <th>{this.props.datetimeCreated}</th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionActive" defaultChecked={this.state.permissionActive == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionBanned" defaultChecked={this.state.permissionBanned == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionAddMoney" defaultChecked={this.state.permissionAddMoney == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionDeductMoney" defaultChecked={this.state.permissionDeductMoney == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionApproveTrip" defaultChecked={this.state.permissionApproveTrip == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionCancelTrip" defaultChecked={this.state.permissionCancelTrip == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionSuspendTrip" defaultChecked={this.state.permissionSuspendTrip == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionEditTrip" defaultChecked={this.state.permissionEditTrip == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionApproveCar" defaultChecked={this.state.permissionApproveCar == true} onChange={this.handleChange} /></label></th>
                    <th><label class="checkbox-inline"><input type="checkbox" name="permissionSuspendCar" defaultChecked={this.state.permissionSuspendCar == true} onChange={this.handleChange} /></label></th>
                    <th>
                        <button type="button" class="btn btn-dark" onClick={this.handleClick}>Apply</button>
                    </th>
                </tr>
            </>
        );
    }
}

export default class AdminTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    handleClick(event) {
        var params = {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            username: this.state.username,
            password: this.state.password,
        };
        axios.post("/createAdminAccount", params)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.status == "OK") {
                    this.setState({
                        username: "",
                        password: "",
                        statusAxios: "OK",
                        message: res.data.message
                    });
                } else if (res.data.status == "ERROR") {
                    this.setState({
                        statusAxios: "ERROR",
                        message: res.data.message
                    });
                }
            })
    }

    render() {
        store.subscribe(() => {
            if (store.getState().received == false) {
                console.log(store.getState());
                var cpage = store.getState();
                store.dispatch({ type: 'RECEIVED' });
                this.setState({
                    statusAxios: cpage.status,
                    message:cpage.message,
                })
            }
        });        
        return (
            <>
                <button type="button" class="btn btn-dark" data-toggle="collapse" data-target=".createNewAdminAccount">Create New Admin Account</button>
                <div class="collapse createNewAdminAccount">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <input type="text" class="form-control" name="username" placeholder="Username" onChange={this.handleChange} />
                        </div>
                        <div class="input-group-prepend">
                            <input type="text" class="form-control" name="password" placeholder="Password" onChange={this.handleChange} />
                        </div>
                        <button class="btn btn-dark" onClick={this.handleClick}>Create</button>
                    </div>
                </div>
                <Alert status={this.state.statusAxios} message={this.state.message} />
                <table className="table .table-bordered table-sm .table-responsive">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">admin Id</th>
                            <th scope="col">admin Name</th>
                            <th scope="col">datetime Created</th>
                            <th scope="col">permission Active</th>
                            <th scope="col">permission Banned</th>
                            <th scope="col">permission Add Money</th>
                            <th scope="col">permission Deduct Money</th>
                            <th scope="col">permission Approve Trip</th>
                            <th scope="col">permission Cancel Trip</th>
                            <th scope="col">permission Suspende Trip</th>
                            <th scope="col">permission Edit Trip</th>
                            <th scope="col">permission Aprrove Car</th>
                            <th scope="col">permission Suspende Car</th>
                            <th scope="col">action</th>
                        </tr>
                    </thead>
                    <LoadAdminTable />
                </table>
            </>
        );
    }
}


class LoadAdminTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            currentPage: 1,
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
    }
    componentDidMount() {
        var superAdmin = {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
        }
        axios.post("/loadAdminAccounts", superAdmin)
            .then(res => {
                console.log(res);
                console.log(res.data);
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
                        <Admin adminId={item.adminId} adminName={item.adminName} datetimeCreated={item.datetimeCreated} permissionActive={item.permissionActive} permissionBanned={item.permissionBanned} permissionAddMoney={item.permissionAddMoney} permissionDeductMoney={item.permissionDeductMoney} permissionApproveTrip={item.permissionApproveTrip} permissionCancelTrip={item.permissionCancelTrip} permissionSuspendTrip={item.permissionSuspendTrip} permissionEditTrip={item.permissionEditTrip} permissionApproveCar={item.permissionApproveCar} permissionSuspendCar={item.permissionSuspendCar} />
                    ))}
                </tbody>
            );
        }
    }
}
