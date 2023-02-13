import { useEffect } from "react";
import { useAuth } from "../services/hooks";

const Logout = () => {
    const auth = useAuth();
    useEffect(() => {
        auth.signOut();
    }, [auth]);
    return null;
};

export default Logout;
