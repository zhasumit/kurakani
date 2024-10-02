import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import loadingAnimation from "./assets/loading.gif";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    // if not authenticated return to auth page
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    // if auth complete => go to the chat page
    return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await apiClient.get(GET_USER_INFO, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data.id) {
                    setUserInfo(response.data);
                } else {
                    setUserInfo(undefined);
                }
                console.log(response);
            } catch (error) {
                setUserInfo(undefined);
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (!userInfo) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [userInfo, setUserInfo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[100vh]">
                <img className="h-96" src={loadingAnimation} alt="" />
            </div>
        );
    }

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/auth"
                        element={
                            <AuthRoute>
                                <Auth />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/chat"
                        element={
                            <PrivateRoute>
                                <Chat />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/auth" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
