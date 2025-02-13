import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RentVerificationAdmin = () => {
    const [verifications, setVerifications] = useState([]);

    useEffect(() => {
        axios.get('/api/rent-verification/')
            .then(response => setVerifications(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleStatusChange = (id, status) => {
        axios.put(`/api/rent-verification/${id}/admin/`, { status })
            .then(response => {
                setVerifications(prevVerifications =>
                    prevVerifications.map(item =>
                        item.id === id ? { ...item, status: response.data.status } : item
                    )
                );
            })
            .catch(error => console.error('Error updating status:', error));
    };

    return (
        <div>
            <h2>Rent Verification Requests</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Images</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {verifications.map(item => (
                        <tr key={item.id}>
                            <td>{item.full_name}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.address}</td>
                            <td>{item.status}</td>
                            <td>
                                {item.images.map(img => (
                                    <img key={img.id} src={img.image} alt="Verification" width="50" />
                                ))}
                            </td>
                            <td>
                                {item.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusChange(item.id, 'verified')}>Approve</button>
                                        <button onClick={() => handleStatusChange(item.id, 'rejected')}>Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RentVerificationAdmin;
