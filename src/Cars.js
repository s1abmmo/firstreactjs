import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies, { set } from 'js-cookie';
import { createStore } from 'redux'
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';

var initialState = {
    status: false,
    objlist: {},
    editMode: false,
    modal: {
        status: false,
        tripCode: null
    }
}

function statusmarket(state = initialState, action) {
    if (action.type === 'INPUT') {
        let newState = state;
        newState.status = true;
        newState.objlist = action.objectlist;
        return newState;
    } else if (action.type === 'RECEIVED') {
        let newState = state;
        newState.status = false;
        return newState;
    }
    else if (action.type === 'EDITMODE') {
        let newState = state;
        newState.editMode = action.editMode;
        newState.status = true;
        return newState;
    } else if (action.type === 'UPDATETRIPCODE') {
        let newState = state;
        newState.modal.tripCode = action.tripCode;
        newState.modal.status = true;
        return newState;
    } else if (action.type === 'RECEIVEDTRIPCODE') {
        let newState = state;
        newState.modal.status = false;
        return newState;
    }
    return state;
}

let store = createStore(statusmarket);

class LoadCars extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // error: null,
            // isLoaded: false,
            items: [],
            currentPage: 1,
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
        };
    }

    componentDidMount() {
        fetch("/adminLoadCars?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&page=" + this.state.currentPage)
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
    render() {
        store.subscribe(() => {
            if (store.getState().status == true) {
                var cpage = store.getState();
                store.dispatch({ type: 'FALSE', value: null });
                console.log("da nhan " + cpage.value)
                this.setState({
                    currentPage: cpage.value
                })
                fetch("/adminLoadCars?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&page=" + cpage.value)
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
                        <Car tripId={item.tripId} tripCode={item.tripCode} tripFrom={item.tripFrom} tripTo={item.tripTo} departureTime={item.departureTime} priceStart={item.priceStart} priceToBuyNow={item.priceToBuyNow} priceBidCurrent={item.priceBidCurrent} tripStatus={item.tripStatus} />
                    ))}
                </tbody>
            );
        }
    }
}


export default class Cars extends React.Component {
    render() {
        return (
            <>
                <table className="table .table-bordered table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">CarIsName</th>
                            <th scope="col">License Plate</th>
                            <th scope="col">Seat</th>
                            <th scope="col">YearOfManufacture</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                            <th scope="col">More</th>
                        </tr>
                    </thead>
                    <LoadCars />
                    <Modal />
                </table>
                <Pagination />
            </>
        );
    }
}

class Car extends React.Component {
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
        this.MoreClick = this.MoreClick.bind(this);
    }
    MoreClick() {
        console.log(this.props.tripCode);
        store.dispatch({ type: 'UPDATETRIPCODE', tripCode: this.props.id });
    };
    render() {
        return (
            <>

                <tr>
                    <th scope="row">{this.props.carId}</th>
                    <th>{this.props.carIsName}</th>
                    <th>{this.props.licensePlate}</th>
                    <th>{this.props.seat}</th>
                    <th>{this.props.yearOfManufacture}</th>
                    <th>{this.props.status}</th>
                    <th>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Action
                                </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" >Approve</a>
                                <a class="dropdown-item" href="#" >Suspende</a>
                            </div>
                        </div>
                    </th>
                    <th>
                        <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onClick={this.MoreClick}>More</button>
                    </th>
                </tr>
            </>
        );
    }
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
            editMode: false,
            tripInfomation: {},
            tripCode: null,
        };
        // this.PreviousPage = this.PreviousPage.bind(this);
        // this.NextPage = this.NextPage.bind(this);
        this.EditClick = this.EditClick.bind(this);
        this.Loop = this.Loop.bind(this);
    }

    componentDidMount() {
        this.Loop();
    }

    EditClick() {
        this.setState({
            editMode: !this.state.editMode
        })
        // store.dispatch({ type: 'EDITMODE' });
    }

    Loop() {
        setTimeout(
            function () {
                if (this.state.tripCode != null) {
                    fetch("/adminLoadCars?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&tripCode=" + this.state.tripCode)
                        .then(res => res.json())
                        .then(
                            (result) => {
                                this.setState({
                                    tripInfomation: result
                                });
                            },
                            (error) => {
                            }
                        )
                }
                this.Loop();
            }
                .bind(this),
            1000
        );
    }

    render() {
        store.subscribe(() => {
            if (store.getState().modal.status == true) {
                var cpage = store.getState();
                store.dispatch({ type: 'RECEIVEDTRIPCODE' });
                console.log(cpage.modal.tripCode)
                this.setState({
                    tripCode: cpage.modal.tripCode
                })
            }
        }
        );
        var departureTime=new Date(this.state.tripInfomation.departureTime).toLocaleDateString("en-US",{year: 'numeric', month: '2-digit',day: '2-digit'});
        // var departureTime=new Date(this.state.tripInfomation.departureTime).toISOString();
        // var departureTimeDate=departureTime.getFullYear()+"-"+departureTime.getMonth()+"-"+departureTime.getDay()+"T"+departureTime.getHours()+":"+departureTime.getMinutes();
        console.log(departureTime);
        return (
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{this.state.tripInfomation.tripId} {this.state.tripInfomation.tripCode}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><div class="row"><div class="col-3">From</div>{this.state.editMode ? <textarea type="text" class="form-control col-5" rows="3" value={this.state.tripInfomation.tripFrom}></textarea> : <div class="col">{this.state.tripInfomation.tripFrom}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">To</div>{this.state.editMode ? <textarea type="text" class="form-control col-5" rows="3" value={this.state.tripInfomation.tripTo}></textarea> : <div class="col">{this.state.tripInfomation.tripTo}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Departure Time</div>{this.state.editMode ? <input type="datetime-local" class="form-control col-5" value={moment(this.state.tripInfomation.departureTime).format('YYYY-MM-DDTHH:SS')}></input> : <div class="col">{new Date(this.state.tripInfomation.departureTime).toLocaleDateString("vi-VN",{year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Method of Receiveing Money</div>{this.state.editMode ? <select class="form-control col-3" id="exampleFormControlSelect1"> <option>The driver takes the money</option> <option>Transfer</option> </select> : <div class="col">{this.state.tripInfomation.methodOfReceivingMoney}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Range Of Verhicle</div>{this.state.editMode ? <input type="text" class="form-control col-5" value={this.state.tripInfomation.rangeOfVehicle}></input> : <div class="col">{this.state.tripInfomation.rangeOfVehicle}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price To Buy Now</div>{this.state.editMode ? <input type="number" class="form-control col-5" value={this.state.tripInfomation.priceToBuyNow}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.priceToBuyNow)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price Start</div>{this.state.editMode ? <input type="number" class="form-control col-5" value={this.state.tripInfomation.priceStart}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.priceStart)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price Bid Current</div>{this.state.editMode ? <input type="number" class="form-control col-5" value={this.state.tripInfomation.priceBidCurrent}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.priceBidCurrent)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Id Last User Bid</div>{this.state.editMode ? <input type="text" class="form-control col-5" value={this.state.tripInfomation.idLastUserBid}></input> : <div class="col">{this.state.tripInfomation.idLastUserBid}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">End Bid</div>{this.state.editMode ? <input type="text" class="form-control col-5" value={this.state.tripInfomation.endBid}></input> : <div class="col">{this.state.tripInfomation.endBid}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price Place Bid</div>{this.state.editMode ? <input type="number" class="form-control col-5" value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.pricePlaceBid)}></input> : <div class="col">{this.state.tripInfomation.pricePlaceBid}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Customer Is FullName</div>{this.state.editMode ? <input type="text" class="form-control col-5" value={this.state.tripInfomation.customerIsFullName}></input> : <div class="col">{this.state.tripInfomation.customerIsFullName}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Customer Is Phone</div>{this.state.editMode ? <input type="number" class="form-control col-5" value={this.state.tripInfomation.customerIsPhone}></input> : <div class="col">{this.state.tripInfomation.customerIsPhone}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Time Open On Market</div>{this.state.editMode ? <input type="datetime-local" class="form-control col-5" value={moment(this.state.tripInfomation.timeOpenOnMarket).format('YYYY-MM-DDTHH:SS')}></input> : <div class="col">{new Date(this.state.tripInfomation.timeOpenOnMarket).toLocaleDateString("vi-VN",{year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Guest Price</div>{this.state.editMode ? <input type="number" class="form-control col-5" value={this.state.tripInfomation.guestPrice}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.guestPrice)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Trip Type</div>{this.state.editMode ? <input type="text" class="form-control col-5" value={this.state.tripInfomation.tripType}></input> : <div class="col">{this.state.tripInfomation.tripType}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Id User Posted</div>{this.state.editMode ? <input type="text" class="form-control col-5" value={this.state.tripInfomation.idUserPosted}></input> : <div class="col">{this.state.tripInfomation.idUserPosted}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Datetime Posted</div>{this.state.editMode ? <input type="datetime-local" class="form-control col-5" value={moment(this.state.tripInfomation.dateTimePosted).format('YYYY-MM-DDTHH:SS')}></input> : <div class="col">{new Date(this.state.tripInfomation.dateTimePosted).toLocaleDateString("vi-VN",{year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>}</div></li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-primary">Approve</button>
                                <button type="button" class="btn btn-secondary" onClick={this.EditClick}>Edit</button>
                                <button type="button" class="btn btn-danger">Suspende</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
        fetch("/carsCountPage?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken)
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
