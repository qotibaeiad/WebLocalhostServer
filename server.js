const express = require('express');
const cors = require('cors');
const MongoDB = require('./mongodb');
const dataHandler = require('./dataHandler');

const app = express();
const port = process.env.PORT || 3000;


// Allowed origins
const allowedOrigins = ['https://web-react-tailwind-client.onrender.com', 'https://deplowwebhw2.vercel.app', 'http://localhost:5173', 'http://localhost:3001', 'http://192.168.14.7:3000'];

// CORS middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Connect to MongoDB
const mongoDB = new MongoDB('mongodb+srv://qotibaeiad98:hrqk7o7dHydnV49a@newtailwind.wce8sqn.mongodb.net/tailwindweb', 'tailwindweb');

(async () => {
  try {
    await mongoDB.connect();

    app.get('/api/articles/:username', async (req, res) => {
      const { username } = req.params;
      console.log(username)
      try {
          const articlesCursor = await mongoDB.db.collection('article').find({ username, isFavorite: true });
          const articles = await articlesCursor.toArray(); // Convert cursor to array
          console.log(articles)
          res.json({ articles });
      } catch (error) {
          console.error('Error fetching articles:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });

    app.post('/api/updateUserPasword', (req, res) => {
      dataHandler.updateuserpassword(mongoDB)(req, res);
    });
    app.post('/api/updateUserData', (req, res) => {
      dataHandler.updateuserdata(mongoDB)(req, res);
    });
    

    // Define API endpoints
    app.get('/api/categories', (req, res) => {
      dataHandler.getCategoryByUser(mongoDB)(req, res);
    });

    app.get('/api/userdata', (req, res) => {
      dataHandler.getUserData(mongoDB)(req, res);
    });

    app.get('/api/data', (req, res) => {
      dataHandler.handleDataRequest(mongoDB)(req, res);
    });

    app.get('/api/login', (req, res) => {
      dataHandler.handleLoginRequest(mongoDB)(req, res);
    });

    app.post('/api/register', (req, res) => {
      dataHandler.handleRegistrationRequest(mongoDB)(req, res);
    });

    app.get('/api/FavoriteArticle', (req, res) => {
      console.log('favor');
      dataHandler.handleFavoriteArticleRequest(mongoDB)(req, res);
    });

    app.post('/api/add-article', (req, res) => {
      dataHandler.handleArticleAddRequest(mongoDB)(req, res);
    });

    app.post('/api/remove-article',(req,res)=>{
      dataHandler.handleArticleRemoveRequest(mongoDB)(req, res);
    });

    app.get('/api/search', (req, res) => {
      dataHandler.handleSearchRequest(mongoDB)(req, res);
    });

    // Update user data endpoint
    app.post('/api/updateUserData', async (req, res) => {
      try {
        await dataHandler.updateuserdata(mongoDB)(req, res);
      } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('Error initializing MongoDB:', error.message);
  }

  app.post('/api/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        const userCollection = mongoDB.db.collection('user');
        const userData = await userCollection.findOne({ email });
        console.log(userData)
        res.json(userData);
        
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();