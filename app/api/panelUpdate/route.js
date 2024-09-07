import { MongoClient } from "mongodb";

export async function GET() {
    const uri = "mongodb+srv://k4nishkk:qwerQWERasdfASDF@kanishkmongodbcluster.dv8uthu.mongodb.net/?retryWrites=true&w=majority&appName=KanishkMongoDBCluster";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('ProductDetailsDB');
        const collection = database.collection('ProductDetails');

        // Retrieve all documents
        const cursor = collection.find({});
    
        // Convert the cursor to an array and log the documents
        const documents = await cursor.toArray();
        return new Response(JSON.stringify({ documents }))
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}