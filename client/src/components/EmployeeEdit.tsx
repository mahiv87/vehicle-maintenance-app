import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
	getOne as getService,
	updateOne as updateService,
	validate as validateService,
	type Employee,
	type MaintenanceRecord
} from '../data/employees';
import EmployeeForm, {
	type FormFieldValue,
	type EmployeeFormState
} from './EmployeeForm';
import PageContainer from './PageContainer';

function EmployeeEditForm({
	initialValues,
	onSubmit
}: {
	initialValues: Partial<EmployeeFormState['values']>;
	onSubmit: (formValues: Partial<EmployeeFormState['values']>) => Promise<void>;
}) {
	const { serviceId } = useParams();
	const navigate = useNavigate();

	const notifications = useNotifications();

	const [formState, setFormState] = React.useState<EmployeeFormState>(() => ({
		values: initialValues,
		errors: {}
	}));
	const formValues = formState.values;
	const formErrors = formState.errors;

	const setFormValues = React.useCallback(
		(newFormValues: Partial<EmployeeFormState['values']>) => {
			setFormState((previousState) => ({
				...previousState,
				values: newFormValues
			}));
		},
		[]
	);

	const setFormErrors = React.useCallback(
		(newFormErrors: Partial<EmployeeFormState['errors']>) => {
			setFormState((previousState) => ({
				...previousState,
				errors: newFormErrors
			}));
		},
		[]
	);

	const handleFormFieldChange = React.useCallback(
		(name: keyof EmployeeFormState['values'], value: FormFieldValue) => {
			const validateField = async (
				values: Partial<EmployeeFormState['values']>
			) => {
				const { issues } = validateService(values);
				setFormErrors({
					...formErrors,
					[name]: issues?.find((issue) => issue.path?.[0] === name)?.message
				});
			};

			const newFormValues = { ...formValues, [name]: value };

			setFormValues(newFormValues);
			validateField(newFormValues);
		},
		[formValues, formErrors, setFormErrors, setFormValues]
	);

	const handleFormReset = React.useCallback(() => {
		setFormValues(initialValues);
	}, [initialValues, setFormValues]);

	const handleFormSubmit = React.useCallback(async () => {
		const { issues } = validateService(formValues);
		if (issues && issues.length > 0) {
			setFormErrors(
				Object.fromEntries(
					issues.map((issue) => [issue.path?.[0], issue.message])
				)
			);
			return;
		}
		setFormErrors({});

		try {
			await onSubmit(formValues);
			notifications.show('Service edited successfully.', {
				severity: 'success',
				autoHideDuration: 3000
			});

			navigate('/services');
		} catch (editError) {
			notifications.show(
				`Failed to edit service. Reason: ${(editError as Error).message}`,
				{
					severity: 'error',
					autoHideDuration: 3000
				}
			);
			throw editError;
		}
	}, [formValues, navigate, notifications, onSubmit, setFormErrors]);

	return (
		<EmployeeForm
			formState={formState}
			onFieldChange={handleFormFieldChange}
			onSubmit={handleFormSubmit}
			onReset={handleFormReset}
			submitButtonLabel="Save"
			backButtonPath={`/services/${serviceId}`}
		/>
	);
}

export default function EmployeeEdit() {
	const { serviceId } = useParams();

	const [service, setService] = React.useState<MaintenanceRecord | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<Error | null>(null);

	const loadData = React.useCallback(async () => {
		setError(null);
		setIsLoading(true);

		try {
			const showData = await getService(Number(serviceId));

			setService(showData);
		} catch (showDataError) {
			setError(showDataError as Error);
		}
		setIsLoading(false);
	}, [serviceId]);

	React.useEffect(() => {
		loadData();
	}, [loadData]);

	const handleSubmit = React.useCallback(
		async (formValues: Partial<EmployeeFormState['values']>) => {
			const updatedData = await updateService(Number(serviceId), formValues);
			setService(updatedData);
		},
		[serviceId]
	);

	const renderEdit = React.useMemo(() => {
		if (isLoading) {
			return (
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						m: 1
					}}
				>
					<CircularProgress />
				</Box>
			);
		}
		if (error) {
			return (
				<Box sx={{ flexGrow: 1 }}>
					<Alert severity="error">{error.message}</Alert>
				</Box>
			);
		}

		return service ? (
			<EmployeeEditForm initialValues={service} onSubmit={handleSubmit} />
		) : null;
	}, [isLoading, error, service, handleSubmit]);

	return (
		<PageContainer
			title={`Edit Service ${serviceId}`}
			breadcrumbs={[
				{ title: 'Services', path: '/services' },
				{ title: `Service ${serviceId}`, path: `/services/${serviceId}` },
				{ title: 'Edit' }
			]}
		>
			<Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
		</PageContainer>
	);
}
