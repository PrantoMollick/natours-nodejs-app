const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  //eslint-disable-next-line
  console.log(`App runing on port ${port}`);
});

