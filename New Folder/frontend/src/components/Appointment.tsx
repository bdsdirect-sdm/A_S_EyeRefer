import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "./Appointment.css";

interface Appointment {
    patientName: string;
    appointmentDate: Date;
    type: 'Consultant' | 'Surgery';
}

const AppointmentForm: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState<Appointment>({
        patientName: '',
        appointmentDate: new Date(),
        type: 'Consultant',
    });

    const [minDate, setMinDate] = useState<string>('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchPatients = async () => {
        try {
            const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.patientList;
        } catch (err) {
            toast.error('Error fetching patient data: ' + err);
            throw err;
        }
    };

    const { data: patients, error, isLoading, isError } = useQuery({
        queryKey: ['patients'],
        queryFn: fetchPatients,
    });

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setMinDate(formattedDate);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === 'appointmentDate' ? new Date(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You can add validation or API call here
        console.log('Appointment Submitted:', formData);
    };

    if (isLoading) {
        return (
            <div>
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-danger">
                Error: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    return (
        <div className="add-patient-container">
            <h2 className="form-title">Create Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="patientName">Patient Name *</label>
                    <select
                        id="patientName"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="">Select a Patient</option>
                        {patients?.map((patient: any) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.firstname} {patient.lastname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appointmentDate">Appointment Date *</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={formData.appointmentDate.toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                        className="form-control"
                        min={minDate}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Appointment Type *</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="form-select"
                    >
                        <option value="Consultant">Consultant</option>
                        <option value="Surgery">Surgery</option>
                    </select>
                </div>

                <button type="submit" className="btn-outline-primary">
                    Submit Appointment
                </button>
            </form>
        </div>
    );
};

export default AppointmentForm;

