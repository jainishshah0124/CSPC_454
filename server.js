const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const mysql = require('mysql2');
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname,"build")));
const PORT = process.env.PORT || 8080;

  const coordinates = [
    { id: 1, lat: 33.6595, lng: -117.9988, info: "Huntington Beach Info" },
    { id: 2, lat: 34.0194, lng: -118.4912, info: "Santa Monica Beach Info" },
    { id: 4, lat: 33.5427, lng: -117.7854, info: "Laguna Beach Info" },
    { id: 5, lat: 33.7701, lng: -118.1937, info: "Long Beach Info" },
    { id: 6, lat: 33.6189, lng: -117.9298, info: "Newport Beach Info" }
  ];
  app.use(cors()); // Enable CORS for all requests

//   app.use(function (req, res, next) {
//     const allowedOrigin = process.env.NODE_ENV === 'production'
//     ? 'https://client-dot-turing-diode-439622-f5.wl.r.appspot.com'  // Production URL
//     : 'http://localhost:3000';  
//     // res.header("Access-Control-Allow-Origin", "https://turing-diode-439622-f5.wl.r.appspot.com");
//     res.header("Access-Control-Allow-Origin", allowedOrigin);
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// const db = mysql.createConnection({
//     host: '34.94.220.194',  
//     user: 'root',
//     password: '1234',  
//     database: 'Beach_DB'
//   });

  let dbconfig = {
    /* Notice! These are here for demo purposes. DO NOT COMMIT YOUR INFO to version control*/
    client: "mysql",
    connection: {
      user: "root",
      password: "1234",
      database: "Beach_DB",
    },
  };
  
  if (process.env.NODE_ENV == "production") {
    dbconfig.connection.socketPath = process.env.GAE_DB_ADDRESS;
  } else {
    dbconfig.connection.host = "34.94.220.194";
  }
  console.log(dbconfig.connection.host);
  const db = mysql.createConnection(dbconfig.connection);

  app.get('/api/get-data', async (req, res) => {
    const query = 'SELECT * FROM beach_info'; 
    try {
      const results = await queryDatabase(query);
      res.json(results); 
    } catch (err) {
      res.status(500).json({ error: err.message }); 
    }
  });
  

  const queryDatabase = (query, params) => {
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) {
          reject(err); // Reject the promise with error if there's an issue
        } else {
          // //console.log(results);
          resolve(results); // Resolve the promise with the results
        }
      });
    });
  };
  



// Endpoint to get nearby places and then fetch place details
app.get('/api/beach-info', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY; // Make sure to store your API key in .env

  try {
    // Step 1: Fetch nearby place details using latitude and longitude
    var nearbySearchResponse="";
    //console.log(lat);
    //console.log("lnggg"+lng);
    var query = "SELECT info FROM nearby_places WHERE lat = '"+lat+"' AND lng='"+lng+"' and NOW()-datetime<501";
    var results = await queryDatabase(query); 
      console.log(results);
      if (results.length === 0) {
        //console.log("inside if");
        nearbySearchResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1&type=beach&key=${apiKey}`
      );
      nearbySearchResponse=nearbySearchResponse.data;
      query = "INSERT INTO nearby_places(lat, lng, info, datetime) VALUES(?,?,?,NOW())";
      db.execute(query, [lat, lng, nearbySearchResponse], (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: err.message });
        } else {
          //console.log('Data inserted successfully:', results);
        }
      });
      }else{
        //console.log("inside else");
        nearbySearchResponse = results[0].info;
        // console.log("nearbySearchResponse --> " + JSON.stringify(nearbySearchResponse, null, 2));
      }


    const placeId =
      nearbySearchResponse.results.length > 0
        ? nearbySearchResponse.results[0].place_id
        : null;
    query = "SELECT data FROM nearby_places_placeid WHERE place_id like '"+placeId+"' and NOW()-datetime<501";
    var results = await queryDatabase(query); 
    console.log("results --> " + results);
    var placeDetailsResponse = "";
    if (results.length === 0) {
      // Step 2: Fetch detailed information about the place using placeId
      placeDetailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
      );
      query = "INSERT INTO nearby_places_placeid(place_id ,data, datetime) VALUES(?,?,NOW())";
      db.execute(query, [placeId, placeDetailsResponse.data], (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: err.message });
        } else {
          console.log('Data inserted successfully:', results);
        }
      });
      console.log("para 2 --> " + placeDetailsResponse.data);
      placeDetailsResponse=placeDetailsResponse.data
    }else{
      placeDetailsResponse=results[0].data;
    }

      // Combine both responses and send them back to the frontend
      // console.log("para 1 --> " + nearbySearchResponse.toString());
      console.log("para 2 --> " + placeDetailsResponse);
      res.json({
        nearby: JSON.stringify(nearbySearchResponse, null, 2),
        details:placeDetailsResponse
      });
  } catch (error) {
    console.error("Error fetching beach data:", error);
    res.status(500).send('Error fetching beach data from Google Places API');
  }
});

function removeCircularReferences(key, value) {
  // Exclude circular references related to axios (socket, _httpMessage, etc.)
  if (key === 'socket' || key === '_httpMessage' || key === 'connection') {
    return undefined; // Skip these properties to avoid circular references
  }
  return value; // Return the value if no circular references are found
}

app.get('/api/tide-info', async (req, res) => {
    const { lat, lon } = req.query; // Example lat, lon for Newport Beach
    const apiKey = process.env.WORLDTIDES_API_KEY; // Store your API key in .env
  
    try {
      const response = await axios.get(
        `https://www.worldtides.info/api/v2?heights&lat=${lat}&lon=${lon}&key=${apiKey}`
      );
  
      const tideData = response.data;
      res.json(tideData);
    } catch (error) {
      console.error('Error fetching tide information:', error);
      res.status(500).send('Unable to fetch tide information');
    }
  });

  const fetchTideInfo = async (lat, lon) => {
    try {
        const apiKey = process.env.WORLDTIDES_API_KEY;
      const response = await axios.get(
        `https://www.worldtides.info/api/v2?heights&lat=${lat}&lon=${lon}&key=${apiKey}`
      );
      //console.log(`Tide data for (${lat}, ${lon}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tide information for (${lat}, ${lon}):`, error);
      return null;
    }
  };

app.get('/api/fetch-all-tide-data', async (req, res) => {
    try {
      const allTideData = [];
      const beaches = JSON.parse(fs.readFileSync('./public/beach.json', 'utf-8'));
      for (const coordinate of beaches) {
        const data = await fetchTideInfo(coordinate.lat, coordinate.lng);
        if (data) {
          allTideData.push({ ...coordinate, data });
        }
      }
  
      // Save the collected tide data to a JSON file
      fs.writeFileSync('tideData.json', JSON.stringify(allTideData, null, 2));
      //console.log('All tide data has been saved to tideData.json');
  
      res.json(allTideData);
    } catch (error) {
      console.error('Error fetching all tide data:', error);
      res.status(500).send('Unable to fetch all tide information');
    }
  });
  
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running YAYYY on port ${PORT}`);
});
