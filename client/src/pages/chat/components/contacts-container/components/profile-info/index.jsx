import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logOut = async () => {
        console.log("clicked");
        try {
            const res = await apiClient.post(
                LOGOUT_ROUTE,
                {},
                { withCredentials: true }
            );

            if (res.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="absolute bottom-0  h-16 flex items-center justify-between  px-4 w-full bg-[#0a101f]">
            <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 relative ">
                    <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt="profile"
                                className={`${getColor(
                                    userInfo.color
                                )} object-cover w-full h-full border-2 rounded-full`}
                            />
                        ) : (
                            <div
                                className={`uppercase w-12 h-12 text-lg border-4 flex items-center justify-center text-white  rounded-full ${getColor(
                                    userInfo.color
                                )}`}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.split("").shift()
                                    : userInfo.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstName && userInfo.lastName
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : "Anonymous"}
                </div>
            </div>
            <div className="flex gap-3 ">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit3
                                className="text-blue-100 font-medium text-lg hover:text-blue-300"
                                onClick={() => navigate("/profile")}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1a1c24] border-none text-white">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <MdOutlineLogout
                                className="text-blue-100 font-medium text-xl hover:text-rose-300"
                                onClick={() => logOut()}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1a1c24] border-none text-white">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;
