import axios from 'axios';
import { takeLatest } from 'redux-saga/effects';

function* sendEmail(action) {
  try {
    const response = yield axios.post('/api/email', action.payload);
  } catch (err) {
    console.log('Error in sendEmail', err);
  }
} // end sendEmail

function* emailDelayedStatus (action) {
  try {
    console.log("🐳 emailDelayedStatus", action.payload);
    
    const response = yield axios.put('/api/email/delayedStatus', action.payload);
  }
  catch (err) {
    console.log('💥 error in the emailDelayedStatus', err);
  }
}; // end emailDelayedStatus

function* emailSaga() {
  yield takeLatest('SEND_EMAIL', sendEmail);
  yield takeLatest('EMAIL_DELAYED_STATUS', emailDelayedStatus)
}

export default emailSaga;
