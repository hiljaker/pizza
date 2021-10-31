import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogoutAction } from '../redux/actions';
import "./styles/Header.css"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaShoppingCart, FaHistory } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        position: "fixed",
        zIndex: 4,
        width: "100%"
    },
    back: {
        backgroundColor: "#FF7600",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        fontSize: 30,
        fontFamily: 'Carter One',
        textDecoration: 'none',
        color: 'white'
    },
}));


const onLogout = () => {
    localStorage.removeItem("token")
    LogoutAction()
    window.location.reload(false);
}

const BasicHeader = (props) => {
    const classes = useStyles()
    let hiUsername = `Hi, ${props.auth.username}!`
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.back}>
                <Toolbar className="bar-item">
                    {props.auth.role === `admin` ? (
                        <Link to="/" className="judul-header">
                            <div>
                                Admin Buwah
                            </div>
                        </Link>
                    ) : (
                        <Link to="/" className="judul-header">
                            <div>
                                Buwah
                            </div>
                        </Link>
                    )}
                    {props.auth.isLogin ? (
                        <div className="top-sec2">
                            <Link to="/history">
                                <FaHistory fontSize={25} color="white" style={{ marginRight: "2vw" }} className="icon-size" />
                            </Link>
                            <Link to="/cart">
                                <FaShoppingCart fontSize={25} color="white" style={{ marginRight: "2vw" }} className="icon-size" />
                            </Link>
                            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                <DropdownToggle className="bg-white text-dark border-white">
                                    {hiUsername.toUpperCase()}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={onLogout}>
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ) : (
                        <Link to="/login" className="txt-link">
                            <Button color="inherit">Login</Button>
                        </Link>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    )
}

const MapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(MapStateToProps, { LogoutAction })(BasicHeader)
