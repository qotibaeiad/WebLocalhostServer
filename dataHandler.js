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
      const { username, password, email, phone, category,country,jobTitle,bio } = req.body;

      // Check if the required fields are present
      if (!username || !password || !email || !phone || !category || !country ||! jobTitle || !bio) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Check if the username is already taken
      const userCollection = mongoDB.db.collection('user');
      const existingUser = await userCollection.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken.' });
      }

      // Insert the new user into the MongoDB collection
      await userCollection.insertOne({ username, password, email, phone, category,country,jobTitle,bio });

      res.json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error handling registration request:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}



function handleArticleAddRequest(mongoDB) {
  return async (req, res) => {
    try {
      const { username, author, title, description, url, urlToImage, publishedAt } = req.body;
      console.log('New Article Values:', { username, author, title, description, url, urlToImage, publishedAt });

      // Check if the required fields are present
      if (!username || !author || !title || !description || !url || !urlToImage || !publishedAt) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Check if the article with the same title already exists
      const articleCollection = mongoDB.db.collection('article');
      const existingArticle = await articleCollection.findOne({ title });

      if (existingArticle) {
        return res.status(400).json({ success: false, message: 'Article with the same title already exists.' });
      }

      // Insert the new article into the MongoDB collection
      await articleCollection.insertOne({ username, author, title, description, url, urlToImage, publishedAt });

      res.json({ success: true, message: 'Article added successfully.' });
    } catch (error) {
      console.error('Error handling article addition request:', error.message);
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
function getCategoryByUser(mongoDB){
  return async (req, res) => {
    try {
      const {username}=req.query
      if (!username) {
        return { error: 'Username is required.' };
      }
      const userCollection = mongoDB.db.collection('user');
      const categories = await userCollection.distinct('category', { username });
      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories from MongoDB:', error.message);
      throw error; 
    }
  }
}

function getUserData(mongoDB) {
  return async (req, res) => {
    try {
      const { username } = req.query;
      // Check if the username is provided
      if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
      }

      // Access the 'user' collection from MongoDB
      const userCollection = mongoDB.db.collection('user');

      // Retrieve user data based on the provided username
      const userData = await userCollection.findOne({ username });

      // Check if the user exists
      if (!userData) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Return the user data in the response
      console.log(userData)
      res.json({ user: userData });
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error('Error fetching user data from MongoDB:', error.message);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  };
}

function updateuserdata(mongoDB) {
  return async (req, res) => {
    try {
      const { username, field, value } = req.body;

      // Update the user data in MongoDB
      const result = await mongoDB.db.collection('user').updateOne(
        { username },
        { $set: { [`${field}`]: value } }
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).json({ success: true, message: 'User data updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'User not found or no data updated' });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}



module.exports = {
  handleDataRequest,
  handleLoginRequest,
  handleRegistrationRequest,
  handleSearchRequest, // Add this line
  getCategoryByUser,
  handleArticleAddRequest,
  getUserData,
  updateuserdata,
};

