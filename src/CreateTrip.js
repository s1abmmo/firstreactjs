import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';

export default class CreateCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
            tripInfomation: {}
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
        var tripInfomation = {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            tripFrom: this.state.tripFrom,
            tripTo: this.state.tripTo,
            departureTime: this.state.departureTime,
            methodOfReceivingMoney: this.state.methodOfReceivingMoney,
            rangeOfVehicle: this.state.rangeOfVehicle,
            priceToBuyNow: this.state.priceToBuyNow,
            priceToStart: this.state.priceToStart,
            pricePlaceBid: this.state.pricePlaceBid,
            customerIsFullName: this.state.customerIsFullName,
            customerIsPhone: this.state.customerIsPhone,
            timeOpenOnMarket: this.state.timeOpenOnMarket,
            guestPrice: this.state.guestPrice,
            tripType: this.state.tripType
        };
        axios.post("/adminCreateTrip", tripInfomation)
            .then(res => {
                if (res.data.status == "OK") {
                    this.setState({
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
                        <label for="tripFrom">From</label>
                        <textarea type="text" class="form-control" rows="3" id="tripFrom" placeholder="From" name="tripFrom" onChange={this.handleChange}></textarea>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="tripTo">To</label>
                        <textarea type="text" class="form-control" rows="3" id="tripTo" placeholder="To" name="tripTo" onChange={this.handleChange}></textarea>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="departureTime">Departure Time</label>
                        <input type="datetime-local" class="form-control" id="departureTime" name="departureTime" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="methodOfReceivingMoney">Method Of Receiving Money</label>
                        <select class="form-control" id="methodOfReceivingMoney" name="methodOfReceivingMoney" onChange={this.handleChange}> <option value="0">The driver takes the money</option> <option value="1">Transfer</option> </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="rangeOfVerhicle">Range Of Verhicle</label>
                        <input type="text" class="form-control" id="rangeOfVerhicle" name="rangeOfVehicle" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="priceToBuyNow">Price To Buy Now</label>
                        <input type="number" class="form-control" id="priceToBuyNow" name="priceToBuyNow" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="priceToStart">Price To Start</label>
                        <input type="number" class="form-control" id="priceToStart" name="priceToStart" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="pricePlaceBid">Price Place Bid</label>
                        <input type="number" class="form-control" id="pricePlaceBid" name="pricePlaceBid" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="customerIsFullName">Customer Is Fullname</label>
                        <input type="text" class="form-control" id="customerIsFullName" name="customerIsFullName" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="customerIsPhone">Customer Is Phone</label>
                        <input type="number" class="form-control" id="customerIsPhone" name="customerIsPhone" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="timeOpenOnMarket">Time Open On Market</label>
                        <input type="datetime-local" class="form-control" id="timeOpenOnMarket" name="timeOpenOnMarket" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="guestPrice">Guest Price</label>
                        <input type="number" class="form-control" id="guestPrice" name="guestPrice" onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="tripType">Trip Type</label>
                        <input type="number" class="form-control" id="tripType" name="tripType" onChange={this.handleChange}></input>
                    </div>
                </div>
                <button class="btn btn-primary" onClick={this.handleClick}>Create Trip</button>
            </>
        );
    }
}

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