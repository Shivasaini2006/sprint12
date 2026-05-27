import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using connection URI from environment.
 * Includes connection event listeners for robustness and visibility.
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr) {
      console.error('CRITICAL: MONGO_URI environment variable is missing.');
      process.exit(1);
    }

    const conn = await mongoose.connect(connStr);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not crash the server immediately if DB goes down during startup, 
    // but log a severe alert. In production, you might want process.exit(1).
    // The user requested: "The app must never crash if: backend is down, MongoDB disconnects, image upload fails, API fails".
  }
};

// Monitor mongoose connection status
mongoose.connection.on('disconnected', () => {
  console.warn('WARNING: MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('SUCCESS: MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB Runtime Error: ${err.message}`);
});

export default connectDB;
