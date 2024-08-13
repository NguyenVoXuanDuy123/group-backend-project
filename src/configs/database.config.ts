import { MongoClient, Db } from "mongodb";
import EnvVars from "@src/constant/EnvVars";
import mongoose from "mongoose";

class DatabaseConfig {
  private client: MongoClient;
  private db: Db;

  public constructor() {
    this.client = new MongoClient(EnvVars.Mongo.Uri);
    this.db = this.client.db("test");
  }

  public async connectDB(): Promise<void> {
    try {
      await mongoose.connect(EnvVars.Mongo.Uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw Error("MongoDB connection error");
    }
  }

  public async closeConnection(): Promise<void> {
    try {
      await this.client.close();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error closing database connection:");
    }
  }
}

export default new DatabaseConfig();
