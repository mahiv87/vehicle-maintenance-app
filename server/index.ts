import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

async function startServer() {
	const client = new MongoClient(process.env.MONGODB_URI!);
	await client.connect();

	const db = client.db(process.env.DB_NAME!);
	const records = db.collection('employees');

	app.get('/api/records', async (req, res) => {
		const items = await records.find().sort({ id: 1 }).toArray();
		res.json({ items, itemCount: items.length });
	});

	app.get('/api/records/:id', async (req, res) => {
		const item = await records.findOne({ id: Number(req.params.id) });

		if (!item) {
			return res.status(404).json({ message: 'Record not found' });
		}

		res.json(item);
	});

	app.post('/api/records', async (req, res) => {
		const last = await records.find().sort({ id: -1 }).limit(1).toArray();

		const newRecord = {
			id: last[0]?.id + 1 || 1,
			...req.body
		};

		await records.insertOne(newRecord);
		res.status(201).json(newRecord);
	});

	app.put('/api/records/:id', async (req, res) => {
		const id = Number(req.params.id);

		await records.updateOne({ id }, { $set: req.body });

		const updated = await records.findOne({ id });
		res.json(updated);
	});

	app.delete('/api/records/:id', async (req, res) => {
		await records.deleteOne({ id: Number(req.params.id) });
		res.status(204).send();
	});

	app.listen(process.env.PORT || 4000, () => {
		console.log(`Server is running on port ${process.env.PORT || 4000}`);
	});
}

startServer().catch((error) => {
	console.error(error);
	process.exit(1);
});

// import express from 'express';
// import cors from 'cors';
// import { MongoClient } from 'mongodb';
// import 'dotenv/config';

// const app = express();

// app.use(cors());
// app.use(express.json());

// const client = new MongoClient(process.env.MONGO_URI!);
// await client.connect();

// const db = client.db(process.env.DB_NAME!);
// const records = db.collection('maintenanceRecords');

// app.get('/api/records', async (req, res) => {
// 	const items = await records.find().sort({ id: 1 }).toArray();
// 	res.json({ items, itemCount: items.length });
// });

// app.get('/api/records/:id', async (req, res) => {
// 	const item = await records.findOne({ id: Number(req.params.id) });

// 	if (!item) {
// 		return res.status(404).json({ message: 'Record not found' });
// 		return;
// 	}

// 	res.json(item);
// });

// app.post('/api/records', async (req, res) => {
// 	const last = await records.find().sort({ id: -1 }).limit(1).toArray();

// 	const newRecord = {
// 		id: last[0]?.id + 1 || 1,
// 		...req.body
// 	};

// 	await records.insertOne(newRecord);
// 	res.status(201).json(newRecord);
// });

// app.put('/api/records/:id', async (req, res) => {
// 	const id = Number(req.params.id);

// 	await records.updateOne({ id }, { $set: req.body });

// 	const updated = await records.findOne({ id });
// 	res.json(updated);
// });

// app.delete('/api/records/:id', async (req, res) => {
// 	await records.deleteOne({ id: Number(req.params.id) });
// 	res.status(204).send();
// });

// app.listen(process.env.PORT, () => {
// 	console.log(`Server is running on port ${process.env.PORT}`);
// });
