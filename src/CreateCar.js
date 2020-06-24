import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios';

export default class CreateCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            items: [],
            adminId: Cookies.get('adminId'),
            adminName: Cookies.get('adminName'),
            adminToken: Cookies.get('adminToken'),
            selectedFile: {}
        };
    }

    onFileChange = event => {
        console.log(event.target.files[0]);
        this.setState({ [event.target.name]: event.target.files[0] });
    };

    onFileUpload = () => {

        const formData = new FormData();
        formData.append(
            "adminId",this.state.adminId            
        );
        formData.append(
            "adminName",this.state.adminName
        );
        formData.append(
            "adminToken",this.state.adminToken
        );

        formData.append(
            "photoRegistration",
            this.state["photoRegistration"],
            this.state["photoRegistration"].name
        );
        formData.append(
            "photoRegistry",
            this.state["photoRegistry"],
            this.state["photoRegistry"].name
        );

        console.log(this.state.selectedFile);

        axios.post("photos", formData);
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
                        <input type="text" class="form-control" id="carisname" placeholder="Car Is Name" />
                    </div>
                    <div class="form-group col-md-6">
                        <label for="licenseplate">License Plate</label>
                        <input type="text" class="form-control" id="licenseplate" placeholder="License Plate" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="seat">Seat</label>
                        <select id="seat" class="form-control">
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
                    <div class="form-group col-md-8">
                        <label for="yearofmanufacture">License Plate</label>
                        <input type="number" class="form-control" id="yearofmanufacture" placeholder="Year of manufacture" />
                    </div>
                </div>
                <div class="form-row">
                    <label class="col-md-4" for="photoRegistration">Photo registration</label>
                    <label class="col-md-4" for="photoRegistry">Photo registry</label>
                    <label class="col-md-4" for="photoInsurance">Photo Insurance</label>
                </div>
                <div class="form-row">
                    <img src="..." class="img-fluid col-md-4" alt="Responsive image" />
                    <img src="..." class="img-fluid col-md-4" alt="Responsive image" />
                    <img src="..." class="img-fluid col-md-4" alt="Responsive image" />
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
                    <label class="form-group col-md-4" for="photoRegistration">Photo registration</label>
                    <label class="form-group col-md-4" for="photoRegistry">Photo registry</label>
                    <label class="form-group col-md-4" for="photoInsurance">Photo Insurance</label>
                </div>
                <div class="form-row">
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile" onChange={this.onFileChange}>Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile" onChange={this.onFileChange}>Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile" onChange={this.onFileChange}>Choose file</label>
                    </div>
                </div>
                <div class="form-row">
                    <label class="form-group col-md-4" for="photoRegistration">Photo registration</label>
                    <label class="form-group col-md-4" for="photoRegistry">Photo registry</label>
                    <label class="form-group col-md-4" for="photoInsurance">Photo Insurance</label>
                </div>
                <div class="form-row">
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile">Choose file</label>
                    </div>
                    <div class="custom-file col-md-4">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile">Choose fil</label>
                    </div>
                </div>
                <button class="btn btn-primary" onClick={this.onFileUpload}>Sign in</button>
            </>
        );
    }
}