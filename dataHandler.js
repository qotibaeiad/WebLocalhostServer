const axios = require('axios');

function handleDataRequest(mongoDB) {
  return async (req, res) => {
    try {
      const { category } = req.query;

      // Use MongoDB here if needed
      // Example: const dataFromMongoDB = await mongoDB.getData();

      // Make a request to the News API with the specified category
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          apiKey: 'c38e86f6a9bd4caca66306488d7fd739',
          country: 'us',
          category: category,
        },
      });

      const articles = response.data.articles;
      // Send the articles back to the client
      res.json({ articles });
    } catch (error) {
      console.error('Error fetching data from News API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
function handleLoginRequest(mongoDB) {
    return async (req, res) => {
      try {
        const { username, password } = req.query;
        console.log(username,' password:',password);
        // Check the username and password in the MongoDB collection named 'users'
        const userCollection = mongoDB.db.collection('user');
        const user = await userCollection.findOne({ username, password });
  
        if (user) {
            console.log("login succses");
          res.json({ success: true, message: 'Login successful!' });
        } else {
            console.log("login faild");
          res.json({ success: false, message: 'Invalid credentials.' });
        }
      } catch (error) {
        console.error('Error handling login request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  }


  //user rigester

  // Modify the handleRegistrationRequest function in the server code
function handleRegistrationRequest(mongoDB) {
  return async (req, res) => {
    try {
      const { username, password, email, phone, category } = req.body;

      // Check if the required fields are present
      if (!username || !password || !email || !phone || !category) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Check if the username is already taken
      const userCollection = mongoDB.db.collection('user');
      const existingUser = await userCollection.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken.' });
      }

      // Insert the new user into the MongoDB collection
      await userCollection.insertOne({ username, password, email, phone, category });

      res.json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error handling registration request:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}
function handleSearchRequest(mongoDB) {
  console.log('fitch search data')
  return async (req, res) => {
    try {
      const { query } = req.query;

      // Use MongoDB here if needed
      // Example: const dataFromMongoDB = await mongoDB.getData();

      // Make a request to the News API with the specified search query
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          apiKey: 'fbd879a61123423d80fc7bb5491bef38',
          q: query,
        },
      });
      const articles = response.data.articles;
      // Send the articles back to the client
      res.json({ articles });
    } catch (error) {
      console.error('Error fetching data from News API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

module.exports = {
  handleDataRequest,
  handleLoginRequest,
  handleRegistrationRequest,
  handleSearchRequest, // Add this line
};

