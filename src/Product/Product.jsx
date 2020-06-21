import React, { Component } from "react";
import Axios from "axios";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const API_URL = `http://localhost:8080`;

export default class Product extends Component {
    state = {
        productList: [],
        productForm: {
            image: "",
            price: 0,
            productName: "",
            id: 0
        },
        editForm: {
            image: "",
            price: 0,
            productName: "",
            id: 0
        },
        modalOpen: false
    }

    getProductList = () => {
        Axios.get(`${API_URL}/products`)
            .then((res) => {
                this.setState({ productList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getProductList()
    }

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    renderProductList = () => {
        return this.state.productList.map((val, idx) => {
            const { productName, price, id } = val;
            return (
                <>
                    <tr>
                        <td> {productName} </td>
                        <td>
                            {" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(price)}{" "}
                        </td>
                        <td className="d-flex">
                            <button onClick={(_) => this.editBtnHandler(idx)}>Edit</button>
                            <button onClick={() => this.deleteHandler(id)}>Delete</button>
                        </td>
                    </tr>
                </>
            );
        });
    };

    fileChangeHandler = (e) => {
        this.setState({ selectedFile: e.target.files[0] });
    };

    fileUploadHandler = () => {
        let formData = new FormData();

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        formData.append("productData", JSON.stringify(this.state.productForm))

        Axios.post(`${API_URL}/products`, formData)
            .then((res) => {
                console.log(res.data);
                this.getProductList()
            })
            .catch((err) => {
                console.log("ERROR");
                console.log(err);
            });
        console.log(JSON.stringify(this.state.productForm));
    };

    deleteHandler = (id) => {
        Axios.delete(`${API_URL}/products/${id}`)
            .then(res => {
                console.log(res)
                this.getProductList()
                alert('Product Removed')
            })
            .catch(err => {
                alert('Product Failed to Remove')
            })
    }

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.productList[idx],
            },
            modalOpen: true,
        });
    };

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    editProductHandler = () => {
        let formData = new FormData();

        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        formData.append("productData", JSON.stringify(this.state.editForm))

        Axios.put(`${API_URL}/products/${this.state.editForm.id}`, formData)
            .then((res) => {
                console.log(res.data);
                this.getProductList()
                alert('Product has been edited')
                this.setState({ modalOpen: false })
            })
            .catch((err) => {
                console.log("ERROR");
                console.log(err);
            });
        console.log(JSON.stringify(this.state.editForm));
    };



    render() {
        return (
            <div>
                <h1>Dashboard Product</h1>
                <center>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>{this.renderProductList()}</tbody>
                    </table>
                </center>
                <div>
                    <h2>Add Product</h2>
                    <div className="row">
                        <div className="col-8">
                            <input type="text"
                                value={this.state.productForm.productName}
                                placeholder="Product Name"
                                onChange={(e) =>
                                    this.inputHandler(e, "productName", "productForm")
                                }
                            />
                        </div>
                        <div className="col-4">
                            <input type="text"
                                value={this.state.productForm.price}
                                placeholder="Price"
                                onChange={(e) => this.inputHandler(e, "price", "productForm")}
                            />
                        </div>
                        <div className="col-4">
                            <input type="file" onChange={this.fileChangeHandler} />
                        </div>
                        <div>
                            <input type="button" value="Simpan" onClick={this.fileUploadHandler} />
                        </div>
                    </div>
                </div>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Product</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <input type="text"
                                    value={this.state.editForm.productName}
                                    placeholder="Product Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "productName", "editForm")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <input type="text"
                                    value={this.state.editForm.price}
                                    placeholder="Price"
                                    onChange={(e) => this.inputHandler(e, "price", "editForm")}
                                />
                            </div>
                            <div className="col-4">
                                <input type="file" onChange={this.fileChangeHandler} />
                            </div>
                            <div>
                                <input type="button" value="Simpan" onClick={this.editProductHandler} />
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}