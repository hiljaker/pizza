import React, { Component } from 'react';
import AdminHeader from '../../components/adminHeader';
import ManageProducts from './manageProducts';
import "./styles/adminHome.css"

class AdminHome extends Component {
    render() {
        return (
            <div className="admin-page">
                <AdminHeader />
                <ManageProducts />
            </div>
        )
    }
}

export default AdminHome;