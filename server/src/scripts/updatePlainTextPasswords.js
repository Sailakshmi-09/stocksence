// updatePlainTextPasswords.js
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

mongoose.connect("mongodb+srv://manushaanusha79:DXnSyut9kBekPbJi@cluster0.o3wi9.mongodb.net/anusha?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true });

async function updatePasswords() {
  const users = await User.find({});
  for (let user of users) {
    if (!user.password.startsWith('$2b$')) { // Check if password is not already hashed
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log(`Updated password for user: ${user.email}`);
    }
  }
  console.log('All plain text passwords updated');
  mongoose.connection.close();
}

updatePasswords();