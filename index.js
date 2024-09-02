
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/User.router');
const courseRoutes = require('./routes/CourseDomain.router');

const userRouter = require('./routes/userRouter');

const app = express();
app.use(express.json());
app.use(cors());
 

mongoose.connect("mongodb+srv://sarandatabase:saran%40143@mycluster.zm3yrdt.mongodb.net/test?retryWrites=true&w=majority&appName=MyCluster", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

 
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the API</h1>
    <p>Available Routes:</p>
    <ul>
      <li><strong>POST</strong> /api/users/register - Register a new user</li>
      <li><strong>POST</strong> /api/courses/add - Add a new course domain</li>
      <li><strong>PUT</strong> /api/courses/edit/:id - Edit an existing course domain</li>
      <li><strong>DELETE</strong> /api/courses/delete/:id - Delete a course domain</li>
      <li><strong>GET</strong> /uploads/:filename - Access uploaded files</li>
    </ul>
  `);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.use('/api/users2', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
