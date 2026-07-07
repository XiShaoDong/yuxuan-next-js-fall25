import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import type { ReactNode } from "react";

export default function Session({ children }: { children: ReactNode }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            dispatch(setCurrentUser(currentUser));
        } catch (err) {
            console.error(err);
        }
        setPending(false);
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    if (pending) {  
        return (  
            <div  
                style={{  
                    display: "flex",  
                    flexDirection: "column",  
                    alignItems: "center",  
                    justifyContent: "center",  
                    minHeight: "100vh",  
                    gap: "12px",  
                }}  
            >  
                <div className="spinner-border text-primary" role="status">  
                    <span className="visually-hidden">Loading...</span>  
                </div>  
                <div>Loading…</div>  
            </div>  
        );  
    }  
    return children; 
}
