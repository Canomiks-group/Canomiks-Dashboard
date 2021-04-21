import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

function LoginForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  /* Store Imports */
  const errors = useSelector((store) => store.errors);

  /* Local State */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = (event) => {
    event.preventDefault();
    if (email && password) {
      console.log('function hit in form')
      dispatch({
        type: 'LOGIN',
        payload: {
          email,
          password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  return (
    <form className={classes.root} onSubmit={login}>
      {errors.loginMessage && errors.loginMessage === 'Account Inactive' ?
        <div style={{ marginTop: 0, marginBottom: 15 }} className="alert" role="alert">
          <Typography variant="h5">Account Inactive</Typography>
          <Typography variant="body1">We are still processing your request.</Typography>
          <Typography variant="body2">For more information about your account, please feel free to reach out.</Typography>
          <Button style={{ marginTop: 10, fontWeight: 650 }} size="small" variant="contained">Contact Us</Button>
        </div> : errors.loginMessage ?
          <Typography className="alert" role="alert" gutterBottom>{errors.loginMessage}</Typography>
          : <></>
      }

      <center>
        <div>
          <TextField
            variant="outlined"
            label="Email"
            size="small"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <TextField
            variant="outlined"
            label="Password"
            size="small"
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div>
          <Button
            type="submit"
            style={{ backgroundColor: '#1e565c', color: 'white', margin: 10, width: '60%' }}
            name="login"
            value="Log In"
          >
            Log In
          </Button>
        </div>
        <div>
          <Link
            onClick={() => {
              history.push('/forgotPassword');
            }}>
            Forgot Password?
        </Link>
        </div>
      </center>
    </form>
  );
}

export default LoginForm;
