import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getAuthStatus } from "./user";

export const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
};

export const useAuth = () => {
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getAuthStatus().then((isValid) => {
            if (isValid) {
                setUser(JSON.parse(window.localStorage.getItem("currentBundoUser")));
            } else {
                setUser(false);
            }
        });
    }, []);

    const signOut = () => {
        window.localStorage.removeItem("currentBundoUser");
        history.replace("/");
        setUser(false);
        window.location.reload();
    };

    return {
        user,
        signOut,
    };
};
