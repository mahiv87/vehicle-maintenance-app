import type {
	GridFilterModel,
	GridPaginationModel,
	GridSortModel
} from '@mui/x-data-grid';

export interface Employee {
	id: number;
	name: string;
	age: number;
	joinDate: string;
	role: string;
	isFullTime: boolean;
}

const API_URL = '/api/records';

export async function getMany({
	paginationModel,
	filterModel,
	sortModel
}: {
	paginationModel: GridPaginationModel;
	sortModel: GridSortModel;
	filterModel: GridFilterModel;
}): Promise<{ items: Employee[]; itemCount: number }> {
	const params = new URLSearchParams({
		page: String(paginationModel.page),
		pageSize: String(paginationModel.pageSize),
		sortModel: JSON.stringify(sortModel),
		filterModel: JSON.stringify(filterModel)
	});

	const response = await fetch(`${API_URL}?${params}`);

	if (!response.ok) {
		throw new Error('Failed to fetch records');
	}

	return response.json();
}

export async function getOne(employeeId: number): Promise<Employee> {
	const response = await fetch(`${API_URL}/${employeeId}`);

	if (!response.ok) {
		throw new Error('Record not found');
	}

	return response.json();
}

export async function createOne(data: Omit<Employee, 'id'>): Promise<Employee> {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		throw new Error('Failed to create record');
	}

	return response.json();
}

export async function updateOne(
	employeeId: number,
	data: Partial<Omit<Employee, 'id'>>
): Promise<Employee> {
	const response = await fetch(`${API_URL}/${employeeId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		throw new Error('Failed to update record');
	}

	return response.json();
}

export async function deleteOne(employeeId: number): Promise<void> {
	const response = await fetch(`${API_URL}/${employeeId}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error('Failed to delete record');
	}
}

type ValidationResult = {
	issues: { message: string; path: (keyof Employee)[] }[];
};

export function validate(employee: Partial<Employee>): ValidationResult {
	let issues: ValidationResult['issues'] = [];

	if (!employee.name) {
		issues = [...issues, { message: 'Name is required', path: ['name'] }];
	}

	if (!employee.age) {
		issues = [...issues, { message: 'Mileage is required', path: ['age'] }];
	}

	if (!employee.joinDate) {
		issues = [
			...issues,
			{ message: 'Service date is required', path: ['joinDate'] }
		];
	}

	if (!employee.role) {
		issues = [
			...issues,
			{ message: 'Parts/notes are required', path: ['role'] }
		];
	}

	return { issues };
}

// import type {
// 	GridFilterModel,
// 	GridPaginationModel,
// 	GridSortModel
// } from '@mui/x-data-grid';

// // type EmployeeRole = 'Market' | 'Finance' | 'Development';

// export interface Employee {
// 	id: number;
// 	name: string;
// 	age: number;
// 	joinDate: string;
// 	role: string;
// 	isFullTime: boolean;
// }

// const INITIAL_EMPLOYEES_STORE: Employee[] = [
// 	{
// 		id: 1,
// 		name: 'Oil Change/Tire Rotation',
// 		age: 170048,
// 		joinDate: '2025-03-15T00:00:00.000Z',
// 		role: 'Castrol Edge Full Synthetic 0W-20',
// 		isFullTime: true
// 	},
// 	{
// 		id: 2,
// 		name: 'Vacuum Pump, Oil Change',
// 		age: 171590,
// 		joinDate: '2025-07-12T00:00:00.000Z',
// 		role: 'Pierburg LR082226, Castrol Edge Full Synthetic 0W-20',
// 		isFullTime: true
// 	},
// 	{
// 		id: 3,
// 		name: 'Wheels/ Tires',
// 		age: 173348,
// 		joinDate: '2026-02-10T00:00:00.000Z',
// 		role: 'Black Rhino BR005MX18855225, BFG KO3 LT265/65R18',
// 		isFullTime: true
// 	}
// ];

// export function getEmployeesStore(): Employee[] {
// 	const stringifiedEmployees = localStorage.getItem('employees-store');
// 	return stringifiedEmployees
// 		? JSON.parse(stringifiedEmployees)
// 		: INITIAL_EMPLOYEES_STORE;
// }

// export function setEmployeesStore(employees: Employee[]) {
// 	return localStorage.setItem('employees-store', JSON.stringify(employees));
// }

// export async function getMany({
// 	paginationModel,
// 	filterModel,
// 	sortModel
// }: {
// 	paginationModel: GridPaginationModel;
// 	sortModel: GridSortModel;
// 	filterModel: GridFilterModel;
// }): Promise<{ items: Employee[]; itemCount: number }> {
// 	const employeesStore = getEmployeesStore();

// 	let filteredEmployees = [...employeesStore];

// 	// Apply filters (example only)
// 	if (filterModel?.items?.length) {
// 		filterModel.items.forEach(({ field, value, operator }) => {
// 			if (!field || value == null) {
// 				return;
// 			}

// 			filteredEmployees = filteredEmployees.filter((employee) => {
// 				const employeeValue = employee[field as keyof Employee];

// 				switch (operator) {
// 					case 'contains':
// 						return String(employeeValue)
// 							.toLowerCase()
// 							.includes(String(value).toLowerCase());
// 					case 'equals':
// 						return employeeValue === value;
// 					case 'startsWith':
// 						return String(employeeValue)
// 							.toLowerCase()
// 							.startsWith(String(value).toLowerCase());
// 					case 'endsWith':
// 						return String(employeeValue)
// 							.toLowerCase()
// 							.endsWith(String(value).toLowerCase());
// 					case '>':
// 						return employeeValue > value;
// 					case '<':
// 						return employeeValue < value;
// 					default:
// 						return true;
// 				}
// 			});
// 		});
// 	}

// 	// Apply sorting
// 	if (sortModel?.length) {
// 		filteredEmployees.sort((a, b) => {
// 			for (const { field, sort } of sortModel) {
// 				if (a[field as keyof Employee] < b[field as keyof Employee]) {
// 					return sort === 'asc' ? -1 : 1;
// 				}
// 				if (a[field as keyof Employee] > b[field as keyof Employee]) {
// 					return sort === 'asc' ? 1 : -1;
// 				}
// 			}
// 			return 0;
// 		});
// 	}

// 	// Apply pagination
// 	const start = paginationModel.page * paginationModel.pageSize;
// 	const end = start + paginationModel.pageSize;
// 	const paginatedEmployees = filteredEmployees.slice(start, end);

// 	return {
// 		items: paginatedEmployees,
// 		itemCount: filteredEmployees.length
// 	};
// }

// export async function getOne(employeeId: number) {
// 	const employeesStore = getEmployeesStore();

// 	const employeeToShow = employeesStore.find(
// 		(employee) => employee.id === employeeId
// 	);

// 	if (!employeeToShow) {
// 		throw new Error('Employee not found');
// 	}
// 	return employeeToShow;
// }

// export async function createOne(data: Omit<Employee, 'id'>) {
// 	const employeesStore = getEmployeesStore();

// 	const newEmployee = {
// 		id:
// 			employeesStore.reduce((max, employee) => Math.max(max, employee.id), 0) +
// 			1,
// 		...data
// 	};

// 	setEmployeesStore([...employeesStore, newEmployee]);

// 	return newEmployee;
// }

// export async function updateOne(
// 	employeeId: number,
// 	data: Partial<Omit<Employee, 'id'>>
// ) {
// 	const employeesStore = getEmployeesStore();

// 	let updatedEmployee: Employee | null = null;

// 	setEmployeesStore(
// 		employeesStore.map((employee) => {
// 			if (employee.id === employeeId) {
// 				updatedEmployee = { ...employee, ...data };
// 				return updatedEmployee;
// 			}
// 			return employee;
// 		})
// 	);

// 	if (!updatedEmployee) {
// 		throw new Error('Employee not found');
// 	}
// 	return updatedEmployee;
// }

// export async function deleteOne(employeeId: number) {
// 	const employeesStore = getEmployeesStore();

// 	setEmployeesStore(
// 		employeesStore.filter((employee) => employee.id !== employeeId)
// 	);
// }

// // Validation follows the [Standard Schema](https://standardschema.dev/).

// type ValidationResult = {
// 	issues: { message: string; path: (keyof Employee)[] }[];
// };

// export function validate(employee: Partial<Employee>): ValidationResult {
// 	let issues: ValidationResult['issues'] = [];

// 	if (!employee.name) {
// 		issues = [...issues, { message: 'Name is required', path: ['name'] }];
// 	}

// 	if (!employee.age) {
// 		issues = [...issues, { message: 'Age is required', path: ['age'] }];
// 	} else if (employee.age < 18) {
// 		issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
// 	}

// 	if (!employee.joinDate) {
// 		issues = [
// 			...issues,
// 			{ message: 'Join date is required', path: ['joinDate'] }
// 		];
// 	}

// 	if (!employee.role) {
// 		issues = [...issues, { message: 'Role is required', path: ['role'] }];
// 	} else if (!['Market', 'Finance', 'Development'].includes(employee.role)) {
// 		issues = [
// 			...issues,
// 			{
// 				message: 'Role must be "Market", "Finance" or "Development"',
// 				path: ['role']
// 			}
// 		];
// 	}

// 	return { issues };
// }
