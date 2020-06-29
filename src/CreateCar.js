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


export default class CreateCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            items: [],
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
            carIsName: null,
            licensePlate: null,
            seat: null,
            yearOfManuFacture: null,
            status: 0
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

    onFileUpload = () => {
        const carInfo = {
            adminId: this.state.adminId,
            adminName: this.state.adminName,
            adminToken: this.state.adminToken,
            carIsName: this.state.carIsName,
            licensePlate: this.state.licensePlate,
            seat: this.state.seat,
            yearOfManuFacture: this.state.yearOfManuFacture,
            status: 0
        };
        axios.post("/createCarInfomation", carInfo)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.status == "OK") {
                    const formData = new FormData();
                    formData.append(
                        "adminId", this.state.adminId
                    );
                    formData.append(
                        "adminName", this.state.adminName
                    );
                    formData.append(
                        "adminToken", this.state.adminToken
                    );
                    formData.append(
                        "carId", res.data.idCar
                    );

                    if (this.state["photoRegistration"] != null)
                        formData.append(
                            "photoRegistration",
                            this.state["photoRegistration"],
                            this.state["photoRegistration"].name
                        );
                    if (this.state["photoRegistry"] != null)
                        formData.append(
                            "photoRegistry",
                            this.state["photoRegistry"],
                            this.state["photoRegistry"].name
                        );
                    if (this.state["photoInsurance"] != null)
                        formData.append(
                            "photoInsurance",
                            this.state["photoInsurance"],
                            this.state["photoInsurance"].name
                        );
                    if (this.state["photoLeftCar"] != null)
                        formData.append(
                            "photoLeftCar",
                            this.state["photoLeftCar"],
                            this.state["photoLeftCar"].name
                        );
                    if (this.state["photoRightCar"] != null)
                        formData.append(
                            "photoRightCar",
                            this.state["photoRightCar"],
                            this.state["photoRightCar"].name
                        );
                    if (this.state["photoFrontCar"] != null)
                        formData.append(
                            "photoFrontCar",
                            this.state["photoFrontCar"],
                            this.state["photoFrontCar"].name
                        );
                    if (this.state["photoBehindCar"] != null)
                        formData.append(
                            "photoBehindCar",
                            this.state["photoBehindCar"],
                            this.state["photoBehindCar"].name
                        );
                    if (this.state["photoDriverIsLicense"] != null)
                        formData.append(
                            "photoDriverIsLicense",
                            this.state["photoDriverIsLicense"],
                            this.state["photoDriverIsLicense"].name
                        );
                    if (this.state["photoIdentityCard"] != null)
                        formData.append(
                            "photoIdentityCard",
                            this.state["photoIdentityCard"],
                            this.state["photoIdentityCard"].name
                        );


                    console.log(this.state.selectedFile);
                    axios.post("photos", formData).then(res => {
                        console.log(res);
                        console.log(res.data);
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
                    });

                }
            })
    };

    fileData = () => {

        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    componentDidMount() {
    }
    render() {
        return (
            <>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="carisname">Car Is Name</label>
                        <input type="text" class="form-control" id="carisname" placeholder="Car Is Name" name="carIsName" onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="licenseplate">License Plate</label>
                        <input type="text" class="form-control" id="licenseplate" placeholder="License Plate" name="licensePlate" onChange={this.handleChange} />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="seat">Seat</label>
                        <select id="seat" class="form-control" name="seat" onChange={this.handleChange}>
                            <option selected>Choose...</option>
                            <option>4</option>
                            <option>5</option>
                            <option>7</option>
                            <option>16</option>
                            <option>29</option>
                            <option>35</option>
                            <option>45</option>
                        </select>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="yearofmanufacture">Year of manufacture</label>
                        <input type="number" class="form-control" id="yearofmanufacture" placeholder="Year of manufacture" name="yearOfManuFacture" onChange={this.handleChange} />
                    </div>
                    <div class="form-group col-md-4">
                        <label for="status">Status</label>
                        <select id="status" class="form-control" name="status" onChange={this.handleChange}>
                            <option selected>Choose...</option>
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                        </select>
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
                        <input type="file" class="custom-file-input" id="photoRegistration" name="photoRegistration" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoRegistration">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="photoRegistry" name="photoRegistry" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoRegistry">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="photoInsurance" name="photoInsurance" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoInsurance">Choose file</label>
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
                        <input type="file" class="custom-file-input" id="photoLeftCar" name="photoLeftCar" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoLeftCar" >Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="photoRightCar" name="photoRightCar" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoRightCar">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="photoFrontCar" name="photoFrontCar" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoFrontCar">Choose file</label>
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
                        <input type="file" class="custom-file-input" id="photoBehindCar" name="photoBehindCar" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoBehindCar">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="photoDriverIsLicense" name="photoDriverIsLicense" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoDriverIsLicense">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="photoIdentityCard" name="photoIdentityCard" onChange={this.onFileChange} />
                        <label class="custom-file-label" for="photoIdentityCard">Choose file</label>
                    </div>
                </div>
                <button class="btn btn-primary" onClick={this.onFileUpload}>Create Car Infomation</button>
                <Alert status={this.state.statusAxios} message={this.state.message}/>
            </>
        );
    }
}