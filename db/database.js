const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lighterbnb'
});

/// Users

const getUserWithEmail = function(email) {
  const promise = pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
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

const getUserWithId = function(id) {
  const promise = pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
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

const addUser = function(user) {
  const promise = pool
    .query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [user.name, user.email, user.password])
    .then((result) => {
      if (!result.rows.length) {
        console.log("error!")
        return (null)
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  return promise
};

/// Reservations

const getAllReservations = function (guest_id, limit = 10) {

  const queryParams = [];
  let queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;

  queryParams.push(`${guest_id}`);
  queryParams.push(limit);

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });

};
// Search

const getAllProperties = function (options, limit = 10) {

  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
    WHERE 1=1`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += ` AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += ` AND cost_per_night > $${queryParams.length}`
  }

  if (options.maximum_price_per_night) {

    queryParams.push(options.maximum_price_per_night * 100);
    queryString += ` AND cost_per_night < $${queryParams.length}`;
  }

  queryString += ` GROUP BY properties.id`

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += ` ORDER BY cost_per_night LIMIT $${queryParams.length};`;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then((result) => result.rows);
};

 // Add a property to the database

const addProperty = function(property) {
  console.log(property);
  return pool
    .query(`
 INSERT INTO properties (
   title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
   VALUES (
   $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
   );
 `, [property.title,
    property.description, property.owner_id, property.cover_photo_url,
    property.thumbnail_photo_url, property.cost_per_night, property.parking_spaces,
    property.number_of_bathrooms, property.number_of_bedrooms,
      true, property.province, property.city, property.country,
    property.street, property.post_code])
    .then((result) => (result.rows[0]))
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
