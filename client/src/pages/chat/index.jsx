import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
    const { userInfo } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        // first setup the prfile and then go to chat
        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue...");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return <div>Chat</div>;
};

export default Chat;
