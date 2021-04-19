import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  inputs: {
    margin: theme.spacing(2),
  },
}));

function ShippingInfo() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  /* Store Imports */
  const currentSample = useSelector((store) => store.orders.currentSample);
  const orderId = currentSample.id;
  const companyID = currentSample.companyID;

  /* Local State */
  const [carrierName, setCarrierName] = useState(currentSample.carrierName);
  const [trackingNumber, setTrackingNumber] = useState(
    currentSample.trackingNumber
  );
  const [shippedDate, setDate] = useState(currentSample.shippedDate);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!shippedDate || !carrierName || !trackingNumber) {
      // TO DO - Change to styled alert
      swal('All inputs are required');
      return;
    } else {
      dispatch({
        type: 'UPDATE_SHIPPING_INFO',
        payload: {
          shippedDate,
          carrierName,
          trackingNumber,
          companyID,
          orderId,
        },
      });

      // TO DO - Change to styled alert
      swal("", 'Shipping Successful!', "success");

      history.push('/samples');
    }
  }; // end handleSubmit

  const continueLaterButton = (event) => {
    event.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Sample cannot be processed until shipping information is entered",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Order not complete", {
          icon: "warning",
        });
        history.push('/samples');
      } 
    });
    // TO DO - Change to styled alert
  

  }; // end continueLaterButton

  return (
    <>
      <center>
        <form>
          <Typography variant="body1">
            These are the available shipping dates. Samples cannot be processed
            until shipping info is filled out
          </Typography>

          <div>
            <TextField
              label="Date to be shipped"
              type="date"
              id="date"
              className={classes.inputs}
              InputLabelProps={{
                shrink: true,
              }}
              value={shippedDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <TextField
              label="Carrier"
              type="text"
              className={classes.inputs}
              variant="standard"
              value={carrierName}
              onChange={(event) => setCarrierName(event.target.value)}
              required
            />
          </div>

          <div>
            <TextField
              label="Tracking Number"
              type="text"
              className={classes.inputs}
              variant="standard"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              required
            />
          </div>
        </form>

        <div>
          <Button
            className={classes.inputs}
            style={{ backgroundColor: '#1e565c', color: 'white' }}
            variant="contained"
            onClick={() => history.push('/sample/add')}
          >
            Back
          </Button>

          <Button
            className={classes.inputs}
            style={{ backgroundColor: '#1e565c', color: 'white' }}
            variant="contained"
            onClick={continueLaterButton}
          >
            Continue Later
          </Button>

          <Button
            className={classes.inputs}
            style={{ backgroundColor: '#1e565c', color: 'white' }}
            variant="contained"
            onClick={handleSubmit}
          >
            Finalize
          </Button>
        </div>
      </center>
    </>
  );
}

export default ShippingInfo;
