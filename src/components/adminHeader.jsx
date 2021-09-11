import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogoutAction } from '../redux/actions';
import "./styles/adminHeader.css"

class AdminHeader extends Component {

    onLogout = () => {
        localStorage.removeItem("id")
        LogoutAction()
        window.location.reload(false);
    }

    render() {
        return (
            <div className="admin-header">
                <h1 className="judul-admin">Admin</h1>
                <div className="button-box">
                    <Link to="/" className="link-style">
                        <button className="admin-header-button">
                            Manage Products
                        </button>
                    </Link>
                </div>
                <div className="button-box">
                    <Link to="/" className="link-style">
                        <button onClick={this.onLogout} className="admin-header-button">
                            Log Out
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(MapStateToProps, { LogoutAction })(AdminHeader);