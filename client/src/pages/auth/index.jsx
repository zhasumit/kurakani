import Background from "../../assets/bg.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Victory from "../../assets/Victory.png";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email required");
            return false;
        }
        if (!password.length) {
            toast.error("Password required");
            return false;
        }
        return true;
    };

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email required");
            return false;
        }
        if (!password.length) {
            toast.error("Password required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(
                LOGIN_ROUTE,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );

            if (response.data.user.id) {
                setUserInfo(response.data.user);
                if (response.data.user.profileSetup) navigate("/chat");
                else navigate("/profile");
            }

            console.log({ response });
        }
    };

    const handleSignup = async () => {
        if (validateSignup()) {
            const response = await apiClient.post(
                SIGNUP_ROUTE,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );

            if (response.status === 201) {
                setUserInfo(response.data.user);
                navigate("/profile");
            }

            console.log({ response });
        }
    };

    return (
        <div className="h-[100vh]  w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-slate-100 border-2 border-white text-opacity-90 shadow-xl w-[90vw] md:w-[90vw] lg:w-[75vw] xl:w-[70vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-1 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-3xl font-semibold md:text-4xl mr-2">
                                Welcome
                            </h1>
                            <img
                                src={Victory}
                                alt="victory emoji"
                                className="h-8"
                            />
                        </div>
                        <p className="font-light text-center">
                            Fill in the details to get started with kurakani
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4 mt-3" defaultValue="login">
                            <TabsList className="bg-transparent w-full rounded-none">
                                <TabsTrigger
                                    value="login"
                                    className="text-lg data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-700 p-3 transition-all duration-300"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    value="signup"
                                    className="text-lg data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-700 p-3 transition-all duration-200"
                                >
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                className="flex flex-col gap-5 mt-10"
                                value="login"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6 text-md"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6 text-md"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Button
                                    className="rounded-full p-6"
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            </TabsContent>
                            <TabsContent
                                className="flex flex-col gap-5"
                                value="signup"
                            >
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6 text-md"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6 text-md"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-6 text-md"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <Button
                                    className="rounded-full p-6"
                                    onClick={handleSignup}
                                >
                                    Signup
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <img
                        src={Background}
                        alt="login background"
                        className="h-0 xl:h-[550px] "
                    />
                </div>
            </div>
        </div>
    );
};

export default Auth;
