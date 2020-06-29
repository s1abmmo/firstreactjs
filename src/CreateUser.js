import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios';

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
        } else if(this.props.status == "ERROR"){
            return (<>
                            <div class="alert alert-danger" role="alert">
                    {this.props.message}
                </div>
            </>);
        }else {
            return (<></>);
        }
    }
}

export default class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    onFileChange = event => {
        console.log(event.target.files[0]);
        this.setState({ [event.target.name]: event.target.files[0] });

        var name = event.target.name + "src";
        var file = event.target.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            this.setState({
                [name]: [reader.result]
            })
            console.log(url)
        }.bind(this);
    };

    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }
    handleClick(event) {
        var userInfomation = {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            username: this.state.username,
            password: this.state.password,
            fullname: this.state.fullname,
            email: this.state.email,
            currentBalance: this.state.currentBalance,
            status: this.state.status
        };
        axios.post("/adminCreateAccount", userInfomation)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.status == "OK") {
                    this.forceUpdate();
                    this.setState({
                        username: "",
                        password: "",
                        fullname: "",
                        email: "",
                        currentBalance: 0,
                        status: null,
                        statusAxios: "OK",
                        message: res.data.message
                    });
                }else if(res.data.status == "ERROR"){
                    this.setState({
                        statusAxios: "ERROR",
                        message: res.data.message
                    });
                }
            })
    }

    componentDidMount() {
    }
    render() {
        return (
            <>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="username">Phone</label>
                        <input type="number" class="form-control" id="username" placeholder="Phone" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="re-password">Re-Password</label>
                        <input type="password" class="form-control" id="re-password" placeholder="Re-Password" name="re-password" value={this.state.repassword} onChange={this.handleChange} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="fullname">Full name</label>
                        <input type="text" class="form-control" id="fullname" placeholder="Email" name="fullname" value={this.state.fullname} onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="re-email" placeholder="Email" name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-4">
                        <label for="currentBalance">Balance</label>
                        <input type="number" class="form-control" id="currentBalance" placeholder="Balance" name="currentBalance" value={this.state.currentBalance} onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="status">Status</label>
                        <select id="status" class="form-control" name="status" value={this.state.status} onChange={this.handleChange}>
                            <option selected>Choose...</option>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>

                </div>
                <button class="btn btn-primary" onClick={this.handleClick}>Create Account</button>
                <Alert status={this.state.statusAxios} message={this.state.message}/>
            </>
        );
    }
}