import React from 'react';
import { auth } from '../routes/firebase';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

    const user = auth.currentUser;
    console.log(user);
    if (user === null) {
        return <Navigate to="/Login" />;
    }

    return children;
}