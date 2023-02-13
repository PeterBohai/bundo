import axios from "axios";

export const getAuthStatus = async () => {
    const loggedUserJSON = window.localStorage.getItem("currentBundoUser");

    if (loggedUserJSON) {
        const loggedUser = JSON.parse(loggedUserJSON);
        const token = loggedUser.token;

        const response = await axios
            .post("/auth/verify", { token })
            .catch((err) => console.error(err));

        if (!response.data.valid) {
            window.localStorage.removeItem("currentBundoUser");
            return false;
        }
        return true;
    }
    return false;
};

export const postBookmarkListChange = (user) => {
    return axios.post("/api/user/bookmark", {
        userid: user.id,
        updatedBookmarks: user.bookmarks,
    });
};
