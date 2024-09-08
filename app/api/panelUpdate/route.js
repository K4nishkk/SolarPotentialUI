import { MongoClient } from "mongodb";

export async function GET() {
    const uri = "mongodb+srv://k4nishkk:qwerQWERasdfASDF@kanishkmongodbcluster.dv8uthu.mongodb.net/?retryWrites=true&w=majority&appName=KanishkMongoDBCluster";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('ProductDetailsDB');
        const collection = database.collection('ProductDetails');

        const cursor = collection.find({});

        const documents = await cursor.toArray();
        return new Response(JSON.stringify({ documents }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}