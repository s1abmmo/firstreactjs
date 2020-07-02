import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies, { set } from 'js-cookie';
import { createStore } from 'redux'
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';
import axios from 'axios';

var initialState = {
    status: false,
    objlist: {},
    editMode: false,
    modal: {
        status: false,
        tripCode: null
    },
    page: {
        currentPage: 1,
        received: true
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
    }else if(action.type === 'CHANGEPAGE'){
        let newState = state;
        newState.page.currentPage = action.newPage;
        newState.page.received = false;
        return newState;
    }
    else if(action.type === 'RECEIVEDPAGE'){
        let newState = state;
        newState.page.received = true;
        return newState;
    }
    return state;
}

let store = createStore(statusmarket);

class LoadMarket extends React.Component {
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
        axios.post("/adminLoadMarket", {
            adminId:this.state.adminId,
            adminName:this.state.adminName,
            adminToken: this.state.adminToken,
            page:this.state.currentPage
        })
        .then(res => {
            this.setState({
                isLoaded: true,
                items: res.data
            });
        })    
    }
    render() {
        store.subscribe(() => {
            if (store.getState().page.received == false) {
                var cpage = store.getState().page;
                store.dispatch({ type: 'RECEIVEDPAGE'});
                console.log("da nhan " + cpage.currentPage)
                this.setState({
                    currentPage: cpage.currentPage
                })
                axios.post("/adminLoadMarket", {
                    adminId:this.state.adminId,
                    adminName:this.state.adminName,
                    adminToken: this.state.adminToken,
                    page:Number(cpage.currentPage) 
                })
                .then(res => {
                    this.setState({
                        isLoaded: true,
                        items: res.data
                    });
                })    

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
                        <Trip tripId={item.tripId} tripCode={item.tripCode} tripFrom={item.tripFrom} tripTo={item.tripTo} departureTime={item.departureTime} priceStart={item.priceStart} priceToBuyNow={item.priceToBuyNow} priceBidCurrent={item.priceBidCurrent} status={item.status} />
                    ))}
                </tbody>
            );
        }
    }
}


export default class Market extends React.Component {
    render() {
        return (
            <>
                <table className="table .table-bordered table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Trip Code</th>
                            <th scope="col" style={{minWidth:'175px'}}>Trip From</th>
                            <th scope="col" style={{minWidth:'175px'}}>Trip To</th>
                            <th scope="col">Departure Time</th>
                            <th scope="col">Price Start</th>
                            <th scope="col">Price To Buy Now</th>
                            <th scope="col">Price Current Bid</th>
                            <th scope="col">Trip Status</th>
                            <th scope="col">Action</th>
                            <th scope="col">More</th>
                        </tr>
                    </thead>
                    <LoadMarket />
                    <Modal />
                </table>
                <Pagination />
            </>
        );
    }
}

class Trip extends React.Component {
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
        this.MoreClick = this.MoreClick.bind(this);
        this.Active = this.Active.bind(this);
        this.Suspende = this.Suspende.bind(this);
    }
    Active() {
        axios.post("/adminActiveTrip", {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            tripId: this.props.tripId,
            tripCode: this.props.tripCode
        })
            .then(response => {
            })
    }

    Suspende() {
        axios.post("/adminSuspendeTrip", {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            tripId: this.props.tripId,
            tripCode: this.props.tripCode
        })
            .then(response => {
            })
    }

    MoreClick() {
        console.log(this.props.tripCode);
        store.dispatch({ type: 'UPDATETRIPCODE', tripCode: this.props.tripCode });
    };
    render() {
        // let b = ".hide" + this.props.id;
        // let a = "collapse hide" + this.props.id;
        // let add = "collapse add" + this.props.id;
        // let addt = ".add" + this.props.id;
        // let deduct = "collapse deduct" + this.props.id;
        // let deductt = ".deduct" + this.props.id;
        // let propstatus= this.props.status=="0" ? "Not actived" : "";
        // propstatus= this.props.status=="1" ? "Actived" : propstatus;
        // propstatus= this.props.status=="2" ? "Banned" : propstatus;
        return (
            <>

                <tr>
                    <th scope="row">{this.props.tripId}</th>
                    <th>{this.props.tripCode}</th>
                    <th>{this.props.tripFrom}</th>
                    <th>{this.props.tripTo}</th>
                    <th>{new Date(this.props.departureTime).toLocaleDateString("vi-VN", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</th>
                    <th>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.props.priceStart)}</th>
                    <th>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.props.priceToBuyNow)}</th>
                    <th>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.props.priceBidCurrent)}</th>
                    <th>{this.props.status}</th>
                    <th>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Action
                                </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick={this.Active}>Active</a>
                                <a class="dropdown-item" href="#" onClick={this.Suspende}>Suspende</a>
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
        console.log("Click page "+name);
        store.dispatch({ type: 'CHANGEPAGE', newPage: name });
    }

    componentWillMount() {
        fetch("/marketCountPage?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken)
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
        // this.Loop = this.Loop.bind(this);
        this.ApplyClick = this.ApplyClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.Active = this.Active.bind(this);
        this.Suspende = this.Suspende.bind(this);
    }
    // IsMounted = false;
    // componentWillMount() {
    //     this.IsMounted = false;
    // }
    // componentDidMount() {
    //     this.IsMounted = true;
    //     this.Loop();
    // }

    EditClick() {
        // this.IsMounted = false;
        this.setState({
            editMode: !this.state.editMode
        })
        // store.dispatch({ type: 'EDITMODE' });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;

        console.log(name + target.value);
        this.setState({
            [name]: target.value
        });
    }

    ApplyClick() {
        var params = {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,

            tripId: this.state.tripInfomation.tripId,
            tripCode: this.state.tripCode,
            tripFrom: this.state.tripFrom,
            tripTo: this.state.tripTo,
            departureTime: this.state.departureTime,
            methodOfReceivingMoney: this.state.methodOfReceivingMoney,
            rangeOfVehicle: this.state.rangeOfVehicle,
            priceToBuyNow: this.state.priceToBuyNow,
            priceStart: this.state.priceStart,
            endBid: this.state.endBid,
            pricePlaceBid: this.state.pricePlaceBid,
            customerIsFullName: this.state.customerIsFullName,
            customerIsPhone: this.state.customerIsPhone,
            timeOpenOnMarket: this.state.timeOpenOnMarket,
            guestPrice: this.state.guestPrice,
            tripType: this.state.tripType,
        };
        axios.post("/adminEditTrip", params)
            .then(res => {
                // store.dispatch({ type: 'INPUT', status: res.data.status, message: this.props.adminName + " " + res.data.message });
            })
        this.IsMounted = true;
        this.setState({
            editMode: !this.state.editMode
        })
        // store.dispatch({ type: 'EDITMODE' });
    }


    // Loop() {
    //     setTimeout(
    //         function () {
    //             console.log(this.IsMounted + this.state.tripCode);
    //             if (this.IsMounted)
    //                 if (this.state.tripCode != null) {
    //                     axios.get("/adminLoadTripInfomation?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&tripCode=" + this.state.tripCode)
    //                         .then(response => {
    //                             this.setState({
    //                                 tripInfomation: response.data
    //                             });

    //                         })
    //                 }
    //             this.Loop();
    //         }
    //             .bind(this),
    //         1000
    //     );
    // }

    Active() {
        axios.post("/adminActiveTrip", {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            tripId: this.state.tripInfomation.tripId,
            tripCode: this.state.tripInfomation.tripCode
        })
            .then(response => {
            })
    }

    Suspende() {
        axios.post("/adminSuspendeTrip", {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            tripId: this.state.tripInfomation.tripId,
            tripCode: this.state.tripInfomation.tripCode
        })
            .then(response => {
            })
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
                axios.post("/adminLoadTripInfomation",{
                    adminId: this.state.adminId,
                    adminName: this.state.adminName,
                    adminToken: this.state.adminToken,
                    tripCode: cpage.modal.tripCode
                })
                .then(response => {
                    this.setState({
                        tripInfomation: response.data
                    });

                })

            }
        }
        );
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
                                <li class="list-group-item">
                                    <div class="row">
                                        <div class="col-3">From</div>
                                        {this.state.editMode ? <textarea name="tripFrom" type="text" class="form-control col-5" rows="3" defaultValue={this.state.tripInfomation.tripFrom} onChange={this.handleChange}></textarea> :
                                            <div class="col">{this.state.tripInfomation.tripFrom}
                                            </div>}
                                    </div>
                                </li>
                                <li class="list-group-item"><div class="row"><div class="col-3">To</div>{this.state.editMode ? <textarea name="tripTo" type="text" class="form-control col-5" rows="3" defaultValue={this.state.tripInfomation.tripTo} onChange={this.handleChange}></textarea> : <div class="col">{this.state.tripInfomation.tripTo}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Departure Time</div>{this.state.editMode ? <input name="departureTime" type="datetime-local" class="form-control col-5" defaultValue={moment(this.state.tripInfomation.departureTime).format('YYYY-MM-DDTHH:SS')} onChange={this.handleChange}></input> : <div class="col">{new Date(this.state.tripInfomation.departureTime).toLocaleDateString("vi-VN", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Method of Receiveing Money</div>{this.state.editMode ? <select name="methodOfReceivingMoney" class="form-control col-3" defaultValue={this.state.tripInfomation.methodOfReceivingMoney} onChange={this.handleChange}> <option value="0">The driver takes the money</option> <option value="1">Transfer</option> </select> : <div class="col">{this.state.tripInfomation.methodOfReceivingMoney}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Range Of Verhicle</div>{this.state.editMode ? <input name="rangeOfVehicle" type="text" class="form-control col-5" defaultValue={this.state.tripInfomation.rangeOfVehicle} onChange={this.handleChange}></input> : <div class="col">{this.state.tripInfomation.rangeOfVehicle}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price To Buy Now</div>{this.state.editMode ? <input name="priceToBuyNow" type="number" class="form-control col-5" defaultValue={this.state.tripInfomation.priceToBuyNow} onChange={this.handleChange}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.priceToBuyNow)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price Start</div>{this.state.editMode ? <input name="priceStart" type="number" class="form-control col-5" defaultValue={this.state.tripInfomation.priceStart} onChange={this.handleChange}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.priceStart)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price Bid Current</div>{this.state.editMode ? <input type="number" class="form-control col-5" defaultValue={this.state.tripInfomation.priceBidCurrent} onChange={this.handleChange} readOnly></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.priceBidCurrent)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Id Last User Bid</div>{this.state.editMode ? <input type="text" class="form-control col-5" defaultValue={this.state.tripInfomation.idLastUserBid} onChange={this.handleChange} readOnly></input> : <div class="col">{this.state.tripInfomation.idLastUserBid}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">End Bid</div>{this.state.editMode ? <select name="endBid" class="form-control col-3" defaultValue={this.state.tripInfomation.endBid} onChange={this.handleChange}> <option value="true">True</option> <option value="false">False</option> </select> : <div class="col">{this.state.tripInfomation.endBid}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Price Place Bid</div>{this.state.editMode ? <input name="pricePlaceBid" type="number" class="form-control col-5" defaultValue={this.state.tripInfomation.pricePlaceBid} onChange={this.handleChange}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.pricePlaceBid)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Customer Is FullName</div>{this.state.editMode ? <input name="customerIsFullName" type="text" class="form-control col-5" defaultValue={this.state.tripInfomation.customerIsFullName}></input> : <div class="col">{this.state.tripInfomation.customerIsFullName}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Customer Is Phone</div>{this.state.editMode ? <input name="customerIsPhone" type="number" class="form-control col-5" defaultValue={this.state.tripInfomation.customerIsPhone} onChange={this.handleChange}></input> : <div class="col">{this.state.tripInfomation.customerIsPhone}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Time Open On Market</div>{this.state.editMode ? <input name="timeOpenOnMarket" type="datetime-local" class="form-control col-5" defaultValue={moment(this.state.tripInfomation.timeOpenOnMarket).format('YYYY-MM-DDTHH:SS')} onChange={this.handleChange}></input> : <div class="col">{new Date(this.state.tripInfomation.timeOpenOnMarket).toLocaleDateString("vi-VN", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Guest Price</div>{this.state.editMode ? <input name="guestPrice" type="number" class="form-control col-5" defaultValue={this.state.tripInfomation.guestPrice} onChange={this.handleChange}></input> : <div class="col">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(this.state.tripInfomation.guestPrice)}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Trip Type</div>{this.state.editMode ? <input name="tripType" type="text" class="form-control col-5" defaultValue={this.state.tripInfomation.tripType} onChange={this.handleChange}></input> : <div class="col">{this.state.tripInfomation.tripType}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Id User Posted</div>{this.state.editMode ? <input type="text" class="form-control col-5" defaultValue={this.state.tripInfomation.idUserPosted} onChange={this.handleChange} readOnly></input> : <div class="col">{this.state.tripInfomation.idUserPosted}</div>}</div></li>
                                <li class="list-group-item"><div class="row"><div class="col-3">Datetime Posted</div>{this.state.editMode ? <input type="datetime-local" class="form-control col-5" defaultValue={moment(this.state.tripInfomation.dateTimePosted).format('YYYY-MM-DDTHH:SS')} onChange={this.handleChange} readOnly></input> : <div class="col">{new Date(this.state.tripInfomation.dateTimePosted).toLocaleDateString("vi-VN", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>}</div></li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-primary" onClick={this.Active}>Active</button>
                                <button type="button" class="btn btn-secondary" onClick={this.state.editMode ? this.ApplyClick : this.EditClick}>{this.state.editMode ? "Apply" : "Edit"}</button>
                                <button type="button" class="btn btn-danger" onClick={this.Suspende}>Suspende</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
