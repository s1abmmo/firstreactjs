import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios';

export default class CreateCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),

        };
        this.handleChange = this.handleChange.bind(this);
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
    componentDidMount() {
    }
    render() {
        return (
            <>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="phone">Phone</label>
                        <input type="number" class="form-control" id="phone" placeholder="Phone" name="phone" onChange={this.handleChange} />
                    </div>
                    </div>
                    <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password" name="password" onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="re-password">Re-Password</label>
                        <input type="password" class="form-control" id="re-password" placeholder="Re-Password" name="re-password" onChange={this.handleChange} />
                    </div>
                    </div>
                    <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="fullname">Full name</label>
                        <input type="text" class="form-control" id="fullname" placeholder="Email" name="fullname" onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="re-email" placeholder="Email" name="email" onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-4">
                        <label for="currentBalance">Balance</label>
                        <input type="number" class="form-control" id="currentBalance" placeholder="Balance" name="currentBalance" onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="status">Status</label>
                        <select id="status" class="form-control" name="status" onChange={this.handleChange}>
                            <option selected>Choose...</option>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>

                </div>
                <button class="btn btn-primary" onClick={this.onFileUpload}>Create Account</button>
            </>
        );
    }
}