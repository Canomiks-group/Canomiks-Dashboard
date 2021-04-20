require('dotenv').config();
const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

/* GET ROUTES */
router.get('/', rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT 
      "orders"."id",
      "orders"."ingredientName",
      "orders"."ingredientAmount",
      "orders"."ingredientUnit",
      "orders"."format",
      "orders"."purity",
      "orders"."dateManufactured",
      "orders"."lotNumber",
      "orders"."extractionMethod",
      "orders"."city",
      "orders"."state",
      "orders"."country",
      "orders"."harvestDate",
      "orders"."cropStrain",
      "orders"."sustainabilityInfo",
      "orders"."shippedDate",
      "orders"."carrierName",
      "orders"."trackingNumber",
      "orders"."receivedDate",
      "orders"."testingStatus",
      "status"."statusName",
      "status"."testState",
      "status"."sequence"
    FROM "orders" 
    JOIN "status"
    ON "status".id = "orders"."testingStatus"
    WHERE orders."companyID" = $1
    ORDER BY ("status".id = 1) DESC;`;

    const dbRes = await pool.query(queryText, [req.user.companyID]);
    res.send(dbRes.rows);
  } catch (err) {
    console.error('Error in GET /', err.message);
    res.sendStatus(500);
  }
});

router.get('/all', rejectUnauthenticated, async (req, res) => {
  try {
    const query = `SELECT * FROM orders ORDER BY ("companyID");`;
    const dbRes = await pool.query(query);

    res.send(dbRes.rows);
  } catch (err) {
    console.error('Error in GET /all', err.message);
    res.sendStatus(500);
  }
});

/* POST ROUTE */
// Initializes a new sample
router.post('/start', rejectUnauthenticated, async (req, res) => {
  try {
    const { companyID, lotNumber } = req.body;
    const sqlText = `
    INSERT INTO "orders"
    ("companyID", "lotNumber") 
    VALUES 
    ($1, $2) 
    RETURNING id;
    `;
    const dbRes = await pool.query(sqlText, [companyID, lotNumber]);
    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    }
  } catch (err) {
    console.error('Error in POST /start', err.message);
    res.sendStatus(500);
  }
});

/* PUT ROUTES */

// Adds sample information after initial sample insert
router.put('/update', rejectUnauthenticated, async (req, res) => {
  try {
    const orderArray = [req.body.value, req.body.companyID, req.body.orderId];
    const tableName = req.body.name;
    const sqlText = `
    UPDATE "orders"
    SET "${tableName}" = $1
    WHERE "companyID" = $2 AND "id" = $3
    RETURNING *;
    `;
    const dbRes = await pool.query(sqlText, orderArray);

    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    }
  } catch (err) {
    console.error('Error in PUT /update', err.message);
    res.sendStatus(500);
  }
});

// Saves shipping information when sample is finalized
router.put('/shipping', rejectUnauthenticated, async (req, res) => {
  try {
    const order = req.body;
    const orderArray = [
      order.shippedDate,
      order.carrierName,
      order.trackingNumber,
      order.companyID,
      order.orderId,
    ];

    const sqlText = `
      UPDATE "orders"
      SET "shippedDate" = $1, "carrierName" = $2, "trackingNumber" = $3
      WHERE "companyID" = $4 AND "id" = $5
      RETURNING *;
    `;
    const dbRes = await pool.query(sqlText, orderArray);

    console.log(dbRes.rows);

    if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    }
  } catch (err) {
    console.error('Error in PUT /shipping', err.message);
    res.sendStatus(500);
  }
});
// Adding pdfurl
router.put('/url', rejectUnauthenticated, async (req, res) => {
  try {
    const order = req.body;
    const orderArray = [ order.pdfUrl,
      order.orderId,]

    const sqlText = `
      UPDATE "orders"
      SET "pdfUrl" = $1 
WHERE "id" = $2
      RETURNING *;
    `;
    const dbRes = await pool.query(sqlText, orderArray);

    console.log(dbRes.rows);

   if (dbRes.rows.length === 0) {
      res.sendStatus(404);
      return;
    } else {
      res.send(dbRes.rows[0]);
    }
  } catch (err) {
    console.error('Error in PUT /url', err.message);
    res.sendStatus(500);
  }
});
/* DELETE ROUTES */
router.delete(
  '/delete/:company/:order',
  rejectUnauthenticated,
  async (req, res) => {
    try {
      const sqlText = `
      DELETE FROM "orders" 
      WHERE "companyID" = $1 AND "id" = $2;
    `;

      const dbRes = await pool.query(sqlText, [
        req.params.company,
        req.params.order,
      ]);

      res.sendStatus(200);
    } catch (err) {
      console.error('Error in DELETE /delete', err.message);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
