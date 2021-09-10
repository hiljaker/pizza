import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogoutAction } from '../redux/actions';
import "./styles/Header.css"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    back: {
        backgroundColor: "#44919C"
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const onLogout = () => {
    localStorage.removeItem("id")
    LogoutAction()
    window.location.reload(false);
}

const BasicHeader = (props) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.back}>
                <Toolbar>
                    {props.auth.role === `admin` ? (
                        <Typography variant="h6" className={classes.title}>
                            Admin Buwah
                        </Typography>
                    ) : (
                        <Typography variant="h6" className={classes.title}>
                            Buwah
                        </Typography>
                    )}
                    {props.auth.isLogin ? (
                        <Typography>
                            hii {props.auth.username}
                        </Typography>
                    ) : null}
                    {props.auth.isLogin ? (
                        <Button onClick={onLogout} color="inherit" className="ms-4">Logout</Button>
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
