import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormHelperText, FormControl, 
  Select, Typography, Grid } from '@material-ui/core';
  import InfoIcon from '@material-ui/icons/Info';
  import Tooltip from '@material-ui/core/Tooltip';
  import Zoom from '@material-ui/core/Zoom';
  import { useHistory } from 'react-router-dom';

function Forgot() {
  const [email, setEmail] = useState('');
  const history = useHistory();

  const resetPassword = `
    Enter your account email to reset your password`;



  const handleSubmit = () => {
    event.preventDefault();
    console.log("submit")
    alert('Request Submitted!')
    setEmail('');
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <Typography 
        variant="h4" 
        align="center" 
        style={{ fontWeight: 550 }} 
        gutterBottom>Reset Password
      </Typography>
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
            <Tooltip title={resetPassword}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-right">
                {/* placement= popup display */}
                <InfoIcon />
            </Tooltip>
        </div>
      
        <div>
        <Button
            style={{
              backgroundColor: '#1e565c',
              color: 'white',
            }}
            onClick={() => {
              history.push('/home');
            }}>
            Back
        </Button>

          <Button
            style={{ backgroundColor: '#1e565c', color: 'white', margin: 10 }}
            name="login"
            value="Log In"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </center>
    </form>
    </div>
  )
}

export default Forgot
