require('dotenv').config();
const http = require('http');
const path = require('path');
const sendMail = require('./src/Config/Setting/nodemailer.config.js');
const routes = require('./src/Api/Routes/index.js');
const { TestSequelizeConnection, TestMySQLConnection, } = require('./src/Config/Database/db.config.js');
const Middleware = require('./src/Api/Middlewares/index.middleware.js');
const axios = require('axios');
const baseUrls = require('./src/Config/Setting/baseurls.config.js');
const { InitializeDatabase } = require('./src/Api/Models/InitializeDatabase.js');

require('./src/Api/sockets/index.socket.js');

const app = Middleware();

const server = http.createServer(app);

const DefineRoutes = () => {

  // axios.get(`${baseUrls.MAIN_SERVER}/api/users`, async (req, res) => {
  //   try {
  //     res.status(200).send('successfully.');
  //     return null
  //   } catch (error) {
      
  //   }
  // })
    
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/aggregate-data', async (req, res) => {
    try {
      const promises = Object.keys(services).map(async (service) => {
        const response = await axios.get(services[service]);
        return { [service]: response.data };
      });

      const results = await Promise.all(promises);
      res.json(results);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data from services' });
    }
  });

  app.post('/send-email', async (req, res) => {
    try {
      const { to, subject, text } = req.body;
      await sendMail(to, subject, text);
      res.status(200).send('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email', { error });
      res.status(500).send('Failed to send email.');
    }
  });

  app.use('/Api', routes);
};

const StartServer = async () => {
  try {

    await Promise.all([
      TestMySQLConnection(),
      TestSequelizeConnection(),
    ]);

    DefineRoutes();

    InitializeDatabase();

    const PORT = process.env.MAIN_SERVER_PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✨ Main server running on port ${PORT} at ${new Date().toLocaleString()}.`);
    })
  } catch (error) {
    console.error('Error during server startup:', error.message);
    console.error('Stack Trace:', error.stack);
    process.exit(1);
  }
};

StartServer();


