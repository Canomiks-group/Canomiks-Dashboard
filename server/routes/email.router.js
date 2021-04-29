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
 * ........
 *   email: users.email
 *   message: 'The message to be sent'
 *   lotNumber: 0000
 * .......
 * }
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  const info = transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: `${req.body.email}`,
      subject: 'Sample info from Canomiks',
      html: `<center><img src="https://images.squarespace-cdn.com/content/5b5bb399cc8fedfa5b4a6d2d/1532760829771-7PJIEDD3JDIXLZIRZCQD/Canomiks-small.jpg?format=1500w&content-type=image%2Fjpeg" alt="Canomiks Logo" width="200"/></center>
      <hr style="width:70%;height:1px;border:none;color:#1e565c;background: -webkit-gradient(linear, 0 0, 100% 0, from(transparent), to(transparent), color-stop(40%, #1e565c), color-stop(60%, #1e565c));">
      <br>
      <div style="color:black;width:60%;margin:auto;font-family:roboto, open sans, sans-serif;font-size:13">
      <p>${req.body.name},</p>
      <p style="text-indent: 2em;">${req.body.message}</p>
      <p><strong>Lot #:</strong> ${req.body.lotNumber}</p>
      <p><strong>Ingredient:</strong> ${req.body.ingredient}</p>
      <p><strong>Strain:</strong> ${req.body.strain}</p>
      <p><strong>Sample Status:</strong> ${req.body.statusName}</p>
      ${
        req.body.pdf
          ? `<p><strong>Log in to your dashboard to see the results</strong></p>`
          : ``
      }
      <p>For more Information please <a href="https://www.canomiks.com/contactus">contact us</a></p
      <br>
      <p>Sincerely,</p>
      <p>The Canomiks Team</p></div>`,
    },
    (err, info) => {
      if (err) {
        console.log('💥 error sending email', err);
        res.sendStatus(500);
        return;
      } else {
        console.log('🎉 it has been sent', info.response);
        res.sendStatus(200);
      }
    }
  );
}); // end basic email

// -------- FORGOT PASSWORD ROUTES --------

// two routes to the forgot password function
router.post('/resetPassword', (req, res) => {
  // get token
  const theToken = req.body.token;
  // check if undefined
  if (theToken === undefined) {
    res.sendStatus(403);
    return;
  }
  // id of person changing password, set after verification
  let personId;
  // verify that the token is good
  jwt.verify(theToken, process.env.JWT_SECRET, (err, authData) => {
    // check for error and return is so
    if (err) {
      res.status(403);
      return;
    }
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

  pool
    .query(sqlText, [password, personId])
    .then((dbRes) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('💥 something happened in the db query', err);
      res.sendStatus(500);
    });
}); // end resetPassword

router.post('/forgotPassword', async (req, res) => {
  try {
    let hostName = `localhost:3000`;
    // for deployment on heroku ???
    if (process.env.DATABASE_URL) {
      const params = url.parse(process.env.DATABASE_URL);
      const theHost = req.hostname;
      hostName = `${theHost}:${params.port}`;
    }
    // get user info from db that matched the entered email
    const sqlText = `
    SELECT * FROM "users"
    WHERE "email" = $1;
    `;
    const dbRes = await pool.query(sqlText, [req.body.email]);

    // if no user if found, return no email found
    if (dbRes.rows.length === 0) {
      res.status(404).send('No email found');
      return;
    }

    // if the email exists, get the info
    const userInfo = dbRes.rows[0];

    // create one time link to send the user
    const secret = process.env.JWT_SECRET;

    const payload = {
      email: userInfo.email,
      id: userInfo.id,
    };

    localToken = jwt.sign(payload, secret);

    const link = `http://${hostName}/#/resetPassword/${localToken}/${userInfo.id}`;

    // send the email to the users email
    const info = await transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: `${req.body.email}`,
        subject: 'Password Change Request',
        text: `
      Regarding your password change request, please click the link provided and follow the instructions there. 
      ${link}
      `,
      },
      (err, info) => {
        if (err) {
          console.log(err);
          res.status(404).send('Email Failed');
          return;
        }
        res.send('email sent');
      }
    );
  } catch (err) {
    console.log('💥 something went wrong with the forgot password', err);
  }
}); // end forgotPassword

//  -------- END FORGOT PASSWORD ROUTE --------

module.exports = router;
