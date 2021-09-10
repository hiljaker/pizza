import React, { Component } from 'react';
import { connect } from 'react-redux';
import BasicHeader from '../components/Header';

class Home extends Component {
    guestText = () => {
        return (
            <h1 className="text-center">Hi, Guest!</h1>
        )
    }

    userText = () => {
        return (
            <h1 className="text-center">Hi, User!</h1>
        )
    }

    adminText = () => {
        return (
            <h1 className="text-center">Hi, Admin!</h1>
        )
    }

    finalText = () => {
        if (this.props.auth.role === `admin`) {
            return this.adminText()
        } else if (this.props.auth.role === `user`) {
            return this.userText()
        } else {
            return this.guestText()
        }
    }

    render() {
        return (
            <div>
                <BasicHeader />
                {this.finalText()}
            </div>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(MapStateToProps)(Home);