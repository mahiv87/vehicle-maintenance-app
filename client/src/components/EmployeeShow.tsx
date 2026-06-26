import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
	deleteOne as deleteService,
	getOne as getService,
	type Employee,
	type MaintenanceRecord
} from '../data/employees';
import PageContainer from './PageContainer';

export default function EmployeeShow() {
	const { serviceId } = useParams();
	const navigate = useNavigate();

	const dialogs = useDialogs();
	const notifications = useNotifications();

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

	const handleEmployeeEdit = React.useCallback(() => {
		navigate(`/services/${serviceId}/edit`);
	}, [navigate, serviceId]);

	const handleEmployeeDelete = React.useCallback(async () => {
		if (!service) {
			return;
		}

		const confirmed = await dialogs.confirm(
			`Do you wish to delete ${service.service}?`,
			{
				title: `Delete employee?`,
				severity: 'error',
				okText: 'Delete',
				cancelText: 'Cancel'
			}
		);

		if (confirmed) {
			setIsLoading(true);
			try {
				await deleteService(Number(serviceId));

				navigate('/services');

				notifications.show('Employee deleted successfully.', {
					severity: 'success',
					autoHideDuration: 3000
				});
			} catch (deleteError) {
				notifications.show(
					`Failed to delete employee. Reason:' ${(deleteError as Error).message}`,
					{
						severity: 'error',
						autoHideDuration: 3000
					}
				);
			}
			setIsLoading(false);
		}
	}, [service, dialogs, serviceId, navigate, notifications]);

	const handleBack = React.useCallback(() => {
		navigate('/services');
	}, [navigate]);

	const renderShow = React.useMemo(() => {
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
			<Box sx={{ flexGrow: 1, width: '100%' }}>
				<Grid container spacing={2} sx={{ width: '100%' }}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Service</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{service.service}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Mileage</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{service.mileage}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Service Date</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{dayjs(service.serviceDate).format('MMMM D, YYYY')}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Notes</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{service.notes}
							</Typography>
						</Paper>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Paper sx={{ px: 2, py: 1 }}>
							<Typography variant="overline">Completed</Typography>
							<Typography variant="body1" sx={{ mb: 1 }}>
								{service.isCompleted ? 'Yes' : 'No'}
							</Typography>
						</Paper>
					</Grid>
				</Grid>
				<Divider sx={{ my: 3 }} />
				<Stack
					direction="row"
					spacing={2}
					sx={{ justifyContent: 'space-between' }}
				>
					<Button
						variant="contained"
						startIcon={<ArrowBackIcon />}
						onClick={handleBack}
					>
						Back
					</Button>
					<Stack direction="row" spacing={2}>
						<Button
							variant="contained"
							startIcon={<EditIcon />}
							onClick={handleEmployeeEdit}
						>
							Edit
						</Button>
						<Button
							variant="contained"
							color="error"
							startIcon={<DeleteIcon />}
							onClick={handleEmployeeDelete}
						>
							Delete
						</Button>
					</Stack>
				</Stack>
			</Box>
		) : null;
	}, [
		isLoading,
		error,
		service,
		handleBack,
		handleEmployeeEdit,
		handleEmployeeDelete
	]);

	const pageTitle = `Service ${service?.id}`;

	return (
		<PageContainer
			title={pageTitle}
			breadcrumbs={[
				{ title: 'Services', path: '/services' },
				{ title: pageTitle }
			]}
		>
			<Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
		</PageContainer>
	);
}
