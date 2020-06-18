import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies, { set } from 'js-cookie';
import { createStore } from 'redux'
import CurrencyFormat from 'react-currency-format';

var initialState = {
    status: false,
    objlist: {},
    editMode: false,
}
function statusmarket(state = initialState, action, value) {
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
        fetch("/adminLoadMarket?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&page=" + this.state.currentPage)
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
                fetch("/adminLoadMarket?adminId=" + this.state.adminId + "&adminName=" + this.state.adminName + "&adminToken=" + this.state.adminToken + "&page=" + cpage.value)
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
                        <Trip tripId={item.tripId} tripCode={item.tripCode} tripFrom={item.tripFrom} tripTo={item.tripTo} departureTime={item.departureTime} priceStart={item.priceStart} priceToBuyNow={item.priceToBuyNow} priceBidCurrent={item.priceBidCurrent} tripStatus={item.tripStatus} />
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
                            <th scope="col">Trip From</th>
                            <th scope="col">Trip To</th>
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
        console.log(this.state.adminId);
    }
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
                    <th>{this.props.departureTime}</th>
                    <th>{this.props.priceStart}</th>
                    <th>{this.props.priceToBuyNow}</th>
                    <th>{this.props.priceBidCurrent}</th>
                    <th>{this.props.tripStatus}</th>
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
                        <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">More</button>
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
        console.log(name);
        store.dispatch({ type: 'VALUE', value: name });
    }

    componentDidMount() {
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
        };
        // this.PreviousPage = this.PreviousPage.bind(this);
        // this.NextPage = this.NextPage.bind(this);
        this.EditClick = this.EditClick.bind(this);
    }
    EditClick() {
        this.setState({
            editMode:true
        })
        // store.dispatch({ type: 'EDITMODE' });
    }
    render() {
        // store.subscribe(() => {
        //     console.log(store.getState());
        // }
        // );
        return (
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">1 FNJEFF</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ul>
                                <li>From:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "From:"}</li>
                                <li>To:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "To:"}</li>
                                <li>Departure Time:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Departure Time:"}</li>
                                <li>Method of Receiveing Money:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Method of Receiveing Money:"}</li>
                                <li>Range Of Verhicle:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Range Of Verhicle:"}</li>
                                <li>Price To Buy Now:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Price To Buy Now:"}</li>
                                <li>Price Start:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Price Start:"}</li>
                                <li>Price Bid Current:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Price Bid Current"}</li>
                                <li>Id Last User Bid:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Id Last User Bid:"}</li>
                                <li>End Bid:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "End Bid:"}</li>
                                <li>Price Place Bid:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Price Place Bid:"}</li>
                                <li>Customer Is FullName:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Customer Is FullName:"}</li>
                                <li>Customer Is Phone:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Customer Is Phone:"}</li>
                                <li>Time Open On Market:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Time Open On Market:"}</li>
                                <li>Guest Price:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Guest Price:"}</li>
                                <li>Trip Type:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Trip Type:"}</li>
                                <li>Id User Posted:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Id User Posted:"}</li>
                                <li>Datetime Posted:{this.state.editMode ? <input type="text" class="form-control mb-2"></input> : "Datetime Posted:"}</li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Approve</button>
                            <button type="button" class="btn btn-secondary" onClick={this.EditClick}>Edit</button>
                            <button type="button" class="btn btn-danger">Suspende</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
