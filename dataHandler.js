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


async function addArticle(username,title, content, author, category, url) {
  const apiUrl = serverUrl + '/api/add-article';

  const articleData = {
    username,
    title,
    content,
    author,
    category,
    url,
  };
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You may include additional headers like authentication tokens if required
      },
      body: JSON.stringify(articleData),
    });

    const data = await response.json();

    if (data.success) {
      console.log('Article added successfully');
      return true;
    } else {
      console.log('Failed to add article');
      return false;
    }
  } catch (error) {
    console.error('Error during article addition request:', error);
    return false;
  }
}

async function handleArticleAddition(username,title, content, author, category, url) {
  try {
    const isArticleAdded = await addArticle(username,title, content, author, category, url);
    if (isArticleAdded) {
      alert('Article added successfully');
      // Additional actions after successful article addition
    } else {
      alert('Failed to add article');
    }
  } catch (error) {
    console.error('Error during article addition:', error);
    alert('An error occurred during article addition');
  }
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



module.exports = {
  handleDataRequest,
  handleLoginRequest,
  handleRegistrationRequest,
  handleSearchRequest, // Add this line
  getCategoryByUser,
  getUserData,
};

