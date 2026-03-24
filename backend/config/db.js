const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection type:', mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔗 Connection Type: ${mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local'}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error details:', error.message);
    
    if (error.message.includes('AtlasError') || error.message.includes('Authentication failed')) {
      console.error('🔍 MongoDB Atlas Authentication Error - Possible causes:');
      console.error('   1. Incorrect username or password');
      console.error('   2. Database user does not have access to the cluster');
      console.error('   3. IP address not whitelisted in Atlas');
      console.error('   4. Cluster not running or incorrect cluster name');
    }
    
    console.error('\n💡 To fix this issue:');
    console.error('1. Check your MongoDB Atlas credentials');
    console.error('2. Ensure your IP is whitelisted in Atlas Network Access');
    console.error('3. Verify the database user has the correct permissions');
    console.error('4. Make sure the cluster is running');
    
    process.exit(1);
  }
};

module.exports = connectDB;
