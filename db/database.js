// const properties = require("./json/properties.json");
// const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lighterbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const promise = pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      // console.log(result.rows);
      if (!result.rows.length) {
        return (null)
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  return promise
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const promise = pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      // console.log(result.rows);
      if (!result.rows.length) {
        return (null)
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  return promise
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const promise = pool
    .query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [user.name, user.email, user.password])
    .then((result) => {
      if (!result.rows.length) {
        console.log("error!")
        return (null)
      }
      console.log(result.rows[0])
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  return promise
};

/// Reservations


const getAllReservations = function(guest_id, limit = 10) {
  const promise = pool
    .query(
      `SELECT reservations.id, properties.*
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;`, [guest_id, limit])
    .then(result => {
      return result.rows
    })
    .catch(err => {
      console.log(err)
    })
  return promise
};

/// Properties

const getAllProperties = (options, limit = 10) => {
  return pool
    .query("SELECT * FROM properties LIMIT $1;", [limit])
    .then((result) => {
      console.log(result.rows.length);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
