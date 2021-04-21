require('dotenv').config();

const jwt = require('jsonwebtoken');
const pool = require('../modules/pool');
const express = require('express');

const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');


/* Nodemailer */
const nodemailer = require('nodemailer');
// make the "transporter"
// this is the email that will do the sending
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

/* POST ROUTES */
/*
 * req.body:
 * {
 *   customerEmail: users.email
 *   message: 'The message to be sent'
 * }
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  const info = transporter.sendMail({
    from: process.env.EMAIL,
    to: `${req.body.customerEmail}`,
    subject: "Sample info from Canomiks",
    text: `${req.body.message}`,
  }, (err, info) => {
    if (err) {
      res.send('💥 error sending email', err);
      return;
    } ;
    console.log('🎉 it has been sent', info.response)
  });
  
  res.sendStatus(200);
}); // end basic email

router.post('/resetPassword', (req, res) => {
  // get token
  const theToken = req.body.token;
  // check if undefined
  if (theToken === undefined) {
    res.sendStatus(403);
    return;
  };
  // id of person changing password, set after verification
  let personId;

  console.log('the token:', theToken);
  // verify that the token is good
  jwt.verify(theToken, process.env.JWT_SECRET, (err, authData) => {
    // check for error and return is so
    if(err) {
      res.status(403);
      return;
    };
    // set person changing password
    personId = authData.id;
  }); // end token verification,
  
  // now that we know its the authorized user,
  // update db with new password
  const sqlText = `
  UPDATE "users"
  SET "password" = $1
  WHERE "id" = $2
  `;
  
  // hash the new password
  const password = encryptLib.encryptPassword(req.body.newPassword);

  pool.query(sqlText, [password, personId]).then((dbRes) => {
    res.sendStatus(200);
  }).catch(err => {
    console.log('💥 something happened in the db query', err);
    res.sendStatus(500);
  });

});


router.post('/forgotPassword', async (req, res) => {
  try{
    console.log('ive made it here')
    // get user info from db that matched the entered email
    const sqlText = `
    SELECT * FROM "users"
    WHERE "email" = $1;
    `;
    const dbRes = await pool.query(sqlText, [req.body.email]);

    // if no user if found, return no email found
    if (dbRes.rows.length === 0) {
      res.status(404).send("No email found")
      return;
    };

    // if the email exists, get the info
    const userInfo = dbRes.rows[0];

    // create one time link to send the user
    const secret = process.env.JWT_SECRET;

    const payload = {
      email: userInfo.email,
      id: userInfo.id
    };

    localToken = jwt.sign(payload, secret);

    const link = `http://localhost:3000/#/resetPassword/${localToken}/${userInfo.id}`

    // send the email to the users email
    const info =  await transporter.sendMail({
      from: process.env.EMAIL,
      to: `${req.body.email}`,
      subject: "Password Change Request",
      text: `
      Regarding your password change request, please click the link provided and follow the instructions there. 
      ${link}
      `,
    }, (err, info) => {
      if (err) {
        console.log(err);
        res.status(404).send("Email Failed")
        return;
      } ;
      res.send('email sent');
    });
    
  }
  catch(err) {
    console.log('💥 something went wrong with the forgot password', err);
  }
});

module.exports = router;
