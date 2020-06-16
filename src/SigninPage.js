import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
//import UserTable from './User';

function AdminLogin(adminName, adminPassword) {
    fetch("/adminLogin?adminName=" + adminName + "&adminPassword=" + adminPassword)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                if (result.status == "OK") {
                    Cookies.set('adminId', result.adminId, { path: '/' });
                    Cookies.set('adminName', result.adminName, { path: '/' });
                    Cookies.set('adminToken', result.adminToken, { path: '/' });
                }
            },
            (error) => {
            }
        )
}


export default class SigninPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: [],
            username: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    handleSubmit(event) {
        console.log(this.state.username);
        AdminLogin(this.state.username, this.state.password);
        event.preventDefault();
    }


    render() {

        // if (this.state.items.status == "OK") {
        //     Cookies.set('adminId', this.state.items.adminId, { path: '/' });
        //     Cookies.set('adminName', this.state.items.adminName, { path: '/' });
        //     Cookies.set('adminToken', this.state.items.adminToken, { path: '/' });
        // }        
        return (
            <>
                <div class="container signinform">
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Username</label>
                            <input type="text" class="form-control" name="username" value={this.state.username} onChange={this.handleChange} />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" name="password" value={this.state.password} onChange={this.handleChange} />
                        </div>
                        <button type="submit" class="btn btn-primary btn-light">Signin</button>
                    </form>
                </div>
            </>
        );
    }
}