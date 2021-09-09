import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

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

export default function BasicHeader() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.back}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Buwah
                    </Typography>
                    <Link to="/login" className="txt-link">
                        <Button color="inherit">Login</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    );
}
