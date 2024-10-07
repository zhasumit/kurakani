import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { colors, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
    ADD_PROFILE_IMAGE_ROUTE,
    HOST,
    REMOVE_PROFILE_IMAGE_ROUTE,
    UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";

const Profile = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color);
        }
        if (userInfo.image) {
            const imageUrl = `${HOST}/${userInfo.image}`;
            setImage(imageUrl);
        }
    }, [userInfo]);

    const validateProfile = () => {
        if (!firstName) {
            toast.error("First name is required");
            return false;
        }
        if (!lastName) {
            toast.error("Last name is required");
            return false;
        }
        return true;
    };

    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                const res = await apiClient.post(
                    UPDATE_PROFILE_ROUTE,
                    {
                        firstName,
                        lastName,
                        color: selectedColor,
                    },
                    { withCredentials: true } // for sending cookies to backend
                );
                if (res.status === 200 && res.data) {
                    setUserInfo({ ...res.data });
                    toast.error("Profile updated successfully");
                    navigate("/chat");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleNavigate = () => {
        if (userInfo.profileSetup) navigate("/chat");
        else toast.error("Please setup your profile");
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file);
            const res = await apiClient.post(
                ADD_PROFILE_IMAGE_ROUTE,
                formData,
                { withCredentials: true }
            );
            if (res.status === 200 && res.data.image) {
                setUserInfo({ ...userInfo, image: res.data.image });
                toast.success("Image updated successfully");
            }
        }
    };
    const handleDeleteImage = async () => {
        try {
            const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
                withCredentials: true,
            });
            if (res.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                toast.success("Image removed successfully");
                setImage(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-[#05080F] h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-10 w-[80vw] md:w-max">
                <div
                    className="text-white/90 cursor-pointer text-3xl lg:text-4xl"
                    onClick={handleNavigate}
                >
                    ←
                </div>
                <div className="grid grid-cols-2">
                    <div
                        className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {image ? (
                                <AvatarImage
                                    src={image}
                                    alt="profile"
                                    className={`${getColor(
                                        selectedColor
                                    )} object-cover w-full h-full border-4 rounded-full`}
                                />
                            ) : (
                                <div
                                    className={`uppercase w-32 h-32 md:w-48 md:h-48 text-7xl border-4 flex items-center justify-center text-white  rounded-full ${getColor(
                                        selectedColor
                                    )}`}
                                >
                                    {firstName
                                        ? firstName.split("").shift()
                                        : userInfo.email.split("").shift()}
                                </div>
                            )}
                        </Avatar>
                        {hovered && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-200 rounded-full text-white text-5xl cursor-pointer"
                                onClick={
                                    image
                                        ? handleDeleteImage
                                        : handleFileInputClick
                                }
                            >
                                {image ? <MdDeleteOutline /> : <FaPlus />}
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                            name="profile-image"
                            accept=".png, .jpg, .jpeg, .svg, .webp, .gif"
                        />
                    </div>
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-4 text-white items-center justify-center">
                        <div className="w-full">
                            <Input
                                placeholder="email"
                                type="email"
                                disabled
                                value={userInfo.email}
                                className="rounded-lg p-5 bg-[#2c2b3e] border-none"
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                placeholder="First Name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="rounded-lg p-5 bg-[#2c2b3e] border-none"
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                placeholder="Last Name"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="rounded-lg p-5 bg-[#2c2b3e] border-none"
                            />
                        </div>
                        <div className="w-full flex gap-1 md:gap-2">
                            {colors.map((color, index) => (
                                <div
                                    className={`${color} h-5 w-5 md:h-8 md:w-8 rounded-full cursor-pointer transition-all duration-300 ${
                                        selectedColor === index
                                            ? "outline outline-white/50"
                                            : ""
                                    }`}
                                    key={index}
                                    onClick={() => setSelectedColor(index)}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <Button
                        className="h-10 w-2/3 bg-blue-900 hover:bg-blue-800 transition-all duration-150"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
