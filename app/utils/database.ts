import {MongoClient, ServerApiVersion} from "mongodb"


// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGODB_URI as string
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri,  {
        serverApi: {
            deprecationErrors: true,
            strict: true,
            version: ServerApiVersion.v1,
        }
    }
);

export const db =  client.db('octolamp')