# LightBnB

A simple multi-page AirBnB clone that uses server-side Javascript to display the information from queries to web pages via SQL queries.

## Getting Set Up

- Clone your repository onto your local device.
- Install dependencies using the ```npm install``` command.
- Start the web server using the ```npm run local``` command. The app will be served at http://localhost:3000/.
- Go to http://localhost:3000/ in your browser.

## Functionality

### Listings Directory
![Listings](https://github.com/pmcall/lighterbnb/blob/master/images/Listings.png?raw=true)
Displays properties and their details to easily browse the available properties.

### User database and logins
![Sign up](https://github.com/pmcall/lighterbnb/blob/master/images/Sign%20up.png?raw=true)
![Login](https://github.com/pmcall/lighterbnb/blob/master/images/Log%20in.png?raw=true)
Log in to access user account details including their personal listings and reservation history.

### Listing Creation
![Create a listing](https://github.com/pmcall/lighterbnb/blob/master/images/Listing%20Creation.png?raw=true)
Add details of your listing to create its own entry into the database!

### Search Feature
![Search for properties](https://github.com/pmcall/lighterbnb/blob/master/images/Search%20Feature.png?raw=true)
Search for the perfect property using features to filter by city, cost and rating!

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js (where the magic happens)
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.
