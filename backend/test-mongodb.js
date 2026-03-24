const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://Personal:pankaj%401814@cluster0.cjvqpry.mongodb.net/personal?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  console.log('📡 Connection string:', MONGODB_URI.replace(/:([^@]+)@/, ':***@'));
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔧 Authentication Error Solutions:');
      console.log('1. Check username and password in MongoDB Atlas');
      console.log('2. Ensure the database user exists and has correct permissions');
      console.log('3. Whitelist your IP address in MongoDB Atlas Network Access');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('\n🔧 Network Error Solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the cluster name is correct');
      console.log('3. Ensure MongoDB Atlas cluster is running');
    }
  }
}

testConnection();
