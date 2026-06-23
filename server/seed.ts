import { MongoClient } from 'mongodb';
import 'dotenv/config';

const employees = [
	{
		id: 1,
		name: 'Oil Change/Tire Rotation',
		age: 170048,
		joinDate: '2025-03-15T00:00:00.000Z',
		role: 'Castrol Edge Full Synthetic 0W-20',
		isFullTime: true
	},
	{
		id: 2,
		name: 'Vacuum Pump, Oil Change',
		age: 171590,
		joinDate: '2025-07-12T00:00:00.000Z',
		role: 'Pierburg LR082226, Castrol Edge Full Synthetic 0W-20',
		isFullTime: true
	},
	{
		id: 3,
		name: 'Wheels/ Tires',
		age: 173348,
		joinDate: '2026-02-10T00:00:00.000Z',
		role: 'Black Rhino BR005MX18855225, BFG KO3 LT265/65R18',
		isFullTime: true
	},
	{
		id: 4,
		name: '4-Wheel Alignment',
		age: 173469,
		joinDate: '2026-02-2500:00:00.000Z',
		role: 'Ellis Automotive',
		isFullTime: true
	},
	{
		id: 5,
		name: 'Rotors/Brake Pads',
		age: 174161,
		joinDate: '2026-03-28T00:00:00.000Z',
		role: 'Power Stop K6227',
		isFullTime: true
	},
	{
		id: 6,
		name: 'Oil Change',
		age: 176105,
		joinDate: '2026-05-17T00:00:00.000Z',
		role: 'Castrol Edge Full Synthetic 0W-20',
		isFullTime: true
	}
];

async function seed() {
	const client = new MongoClient(process.env.MONGODB_URI!);

	try {
		await client.connect();

		const db = client.db(process.env.DB_NAME);
		const collection = db.collection('employees');

		await collection.deleteMany({});
		await collection.insertMany(employees);

		console.log(`Seeded ${employees.length} employees`);
	} finally {
		await client.close();
	}
}

seed();

// import { MongoClient } from 'mongodb';
// import 'dotenv/config';

// const records = [
// 	{
// 		id: 1,
// 		service: 'Oil Change/Tire Rotation',
// 		mileage: 170048,
// 		serviceDate: '2025-03-15T00:00:00.000Z',
// 		parts: 'Castrol Edge Full Synthetic 0W-20',
// 		completed: true
// 	},
// 	{
// 		id: 2,
// 		service: 'Vacuum Pump, Oil Change',
// 		mileage: 171590,
// 		serviceDate: '2025-07-12T00:00:00.000Z',
// 		parts: 'Pierburg LR082226, Castrol Edge Full Synthetic 0W-20',
// 		completed: true
// 	},
// 	{
// 		id: 3,
// 		service: 'Wheels/Tires',
// 		mileage: 173348,
// 		serviceDate: '2026-02-10T00:00:00.000Z',
// 		parts: 'Black Rhino BR005MX18855225, BFG KO3 LT265/65R18',
// 		completed: true
// 	}
// ];

// async function seed() {
// 	const client = new MongoClient(process.env.MONGODB_URI!);

// 	try {
// 		await client.connect();

// 		const db = client.db(process.env.DB_NAME);
// 		const collection = db.collection('maintenanceRecords');

// 		// Optional: wipe existing data
// 		await collection.deleteMany({});

// 		await collection.insertMany(records);

// 		console.log(`Inserted ${records.length} records`);
// 	} catch (error) {
// 		console.error(error);
// 	} finally {
// 		await client.close();
// 	}
// }

// seed();
