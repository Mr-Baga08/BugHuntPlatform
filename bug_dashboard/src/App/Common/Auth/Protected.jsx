import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Protected({children}){
    const navigate = useNavigate(); // Fixed: Added parentheses to call the hook
    const user = localStorage.getItem("userName");
    
    useEffect(() => {
        if(!user || user === ""){
            navigate('/signin');
        }
    }, [user, navigate]); // Added proper dependencies
    
    return (<div>{children}</div>);
}
