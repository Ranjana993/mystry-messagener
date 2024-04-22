import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL! || "", {})
    connection.isConnected = db.connections[0].readyState
    console.log("db is connected successfully")
  }
  catch (error) {
    console.log("db is fail while connecting to datatbase")
    process.exit(1)
  }

}