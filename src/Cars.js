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
        received: true,
        carId: null
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
    } else if (action.type === 'UPDATECARID') {
        let newState = state;
        newState.modal.carId = action.carId;
        newState.modal.received = false;
        return newState;
    } else if (action.type === 'RECEIVEDCARID') {
        let newState = state;
        newState.modal.received = true;
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
                        <Car id={item.id} carIsName={item.carIsName} licensePlate={item.licensePlate} seat={item.seat} yearOfManufacture={item.yearOfManufacture} status={item.status} />
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
        this.MoreClick = this.MoreClick.bind(this);
    }
    MoreClick() {
        console.log(this.props.id);
        store.dispatch({ type: 'UPDATECARID', carId: this.props.id });
    };
    render() {
        return (
            <>

                <tr>
                    <th scope="row">{this.props.id}</th>
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
            carInfomation: [],
            carId: null
        };
        this.EditClick = this.EditClick.bind(this);
        this.Loop = this.Loop.bind(this);
    }
    IsMounted = false;
    componentWillMount() {
        this.IsMounted = false;
        // axios.get("/adminLoadCars", { fileName: "upload/21-photoRegistration.jpg" })
        //     .then(res => {
        //         console.log(res)
        //     });
    }
    componentDidMount() {
        this.IsMounted = true;
        this.Loop();
    }

    EditClick() {
        this.setState({
            editMode: !this.state.editMode
        })
    }

    Loop() {
        setTimeout(
            function () {
                if (this.IsMounted)
                    if (this.state.carId != null) {
                        this.IsMounted = false;
                        var carInfo = {
                            adminId: this.state.adminId,
                            adminName: this.state.adminName,
                            adminToken: this.state.adminToken,
                            carId: this.state.carId
                        };
                        axios.post("/adminLoadCarInfo", carInfo)
                            .then(res => {
                                this.setState({
                                    carInfomation: res.data
                                });
                                // axios.get("/adminLoadCars", { fileName: this.state.carInfomation.photoLinkRegistrationCar })
                                //     .then(res => {
                                //         this.setState({
                                //             photoRegistrationsrc: res.data
                                //         });
                                //     })
                                // axios.post("/adminLoadCars", { fileName: this.state.carInfomation.photoLinkphotoRegistryCar })
                                //     .then(res => {
                                //         this.setState({
                                //             photoRegistrysrc: res.data
                                //         });
                                //     })
                                // axios.post("/adminLoadCars", { fileName: fileName })
                                //     .then(res => {
                                //         this.setState({
                                //             photoInsurancesrc: res.data
                                //         });
                                //     })

                            })
                    }
                this.Loop();
            }
                .bind(this),
            1000
        );
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

    render() {
        store.subscribe(() => {
            if (store.getState().modal.received == false) {
                var cpage = store.getState();
                store.dispatch({ type: 'RECEIVEDCARID' });
                console.log("da nhan carID "+cpage.modal.carId)
                this.setState({
                    carId: cpage.modal.carId
                })
            }
        }
        );

        return (
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{this.state.carInfomation.id}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <div class="form-row">
                                <div class="col-md-4">
                                    Car Is Name
                                {this.state.editMode ?
                                        <input type="text" class="form-control" id="carisname" placeholder={this.state.carInfomation.carIsName} name="carIsName" onChange={this.handleChange} />
                                        :
                                        <div>{this.state.carInfomation.carIsName}</div>}
                                </div>
                                <div class="form-group col-md-4">
                                    License Plate
                                    {this.state.editMode ?
                                        <input type="text" class="form-control" id="licenseplate" placeholder={this.state.carInfomation.licensePlate} name="licensePlate" onChange={this.handleChange} />
                                        :
                                        <div>{this.state.carInfomation.licensePlate}</div>}
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-2">
                                    Vehicle
                                        {this.state.editMode ?
                                        <select id="seat" class="form-control" value={this.state.carInfomation.seat} name="seat" onChange={this.handleChange}>
                                            <option selected>Choose...</option>
                                            <option value="4">4-seater</option>
                                            <option value="5">5-seater</option>
                                            <option value="7">7-seater</option>
                                            <option value="16">16-seater</option>
                                            <option value="29">29-seater</option>
                                            <option value="35">35-seater</option>
                                            <option value="45">45-seater</option>
                                        </select>
                                        :
                                        <div>{this.state.carInfomation.seat}-seater</div>}
                                </div>
                                <div class="form-group col-md-3">
                                    Year of manufacture
                                    {this.state.editMode ?
                                        <input type="number" class="form-control" id="yearofmanufacture" placeholder={this.state.carInfomation.yearOfManufacture} name="yearOfManufacture" onChange={this.handleChange} />
                                        :
                                        <div>{this.state.carInfomation.yearOfManufacture}</div>}
                                </div>
                                <div class="form-group col-md-2">
                                    Status
                                    {this.state.editMode ?
                                        <select id="status" class="form-control" name="status" defaultValue={this.state.carInfomation.status} onChange={this.handleChange}>
                                            <option selected>Choose...</option>
                                            <option value="0">Not active</option>
                                            <option value="1">Active</option>
                                            <option value="2">Suspende</option>
                                        </select>
                                        :
                                        <div>{this.state.carInfomation.status}</div>}
                                </div>
                            </div>
                            <div class="form-row">
                                <label class="col-md-4" for="photoRegistration">Photo registration</label>
                                <label class="col-md-4" for="photoRegistry">Photo registry</label>
                                <label class="col-md-4" for="photoInsurance">Photo Insurance</label>
                            </div>
                            <div class="form-row">
                                <img src={this.state.photoRegistrationsrc} class="img-fluid col-md-4" alt="No image" />
                                <img src={this.state.photoRegistrysrc} class="img-fluid col-md-4" alt="No image" />
                                <img src={this.state.photoInsurancesrc} class="img-fluid col-md-4" alt="No image" />
                            </div>
                            <div class="form-row">
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoRegistration" name="photoRegistration" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoRegistration">Choose file</label>
                                        </>
                                        :
                                        <div></div>}

                                </div>
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoRegistry" name="photoRegistry" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoRegistry">Choose file</label>
                                        </>
                                        :
                                        <div></div>}

                                </div>
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoInsurance" name="photoInsurance" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoInsurance">Choose file</label>
                                        </>
                                        :
                                        <div></div>}

                                </div>
                            </div>
                            <div class="form-row">
                                <label class="form-group col-md-4" for="photoLeftCar">Photo Left Car</label>
                                <label class="form-group col-md-4" for="photoRightCar">Photo Right Car</label>
                                <label class="form-group col-md-4" for="photoFrontCar">Photo Front Car</label>
                            </div>
                            <div class="form-row">
                                <img src={this.state.photoLeftCarsrc} class="img-fluid col-md-4" alt="No image" />
                                <img src={this.state.photoRightCarsrc} class="img-fluid col-md-4" alt="No image" />
                                <img src={this.state.photoFrontCarsrc} class="img-fluid col-md-4" alt="No image" />
                            </div>
                            <div class="form-row">
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoLeftCar" name="photoLeftCar" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoLeftCar" >Choose file</label>
                                        </>
                                        :
                                        <div></div>}
                                </div>
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoRightCar" name="photoRightCar" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoRightCar">Choose file</label>
                                        </>
                                        :
                                        <div></div>}
                                </div>
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoFrontCar" name="photoFrontCar" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoFrontCar">Choose file</label>
                                        </>
                                        :
                                        <div></div>}
                                </div>
                            </div>
                            <div class="form-row">
                                <label class="form-group col-md-4" for="photoBehindCar">Photo Behind Car</label>
                                <label class="form-group col-md-4" for="photoDriverIsLicense">Photo Driver Is License</label>
                                <label class="form-group col-md-4" for="photoIdentityCard">Photo Identity Card</label>
                            </div>
                            <div class="form-row">
                                <img src={this.state.photoBehindCarsrc} class="img-fluid col-md-4" alt="No image" />
                                <img src={this.state.photoDriverIsLicensesrc} class="img-fluid col-md-4" alt="No image" />
                                <img src={this.state.photoIdentityCardsrc} class="img-fluid col-md-4" alt="No image" />
                            </div>
                            <div class="form-row">
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoBehindCar" name="photoBehindCar" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoBehindCar">Choose file</label>
                                        </>
                                        :
                                        <div></div>}
                                </div>
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoDriverIsLicense" name="photoDriverIsLicense" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoDriverIsLicense">Choose file</label>
                                        </>
                                        :
                                        <div></div>}
                                </div>
                                <div class="custom-file col-md-4">
                                    {this.state.editMode ?
                                        <>
                                            <input type="file" class="custom-file-input" id="photoIdentityCard" name="photoIdentityCard" onChange={this.onFileChange} />
                                            <label class="custom-file-label" for="photoIdentityCard">Choose file</label>
                                        </>
                                        :
                                        <div></div>}
                                </div>
                            </div>
                            <button class="btn btn-primary" onClick={this.onFileUpload}>Create Car Infomation</button>
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
