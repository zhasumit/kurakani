import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { RiEmojiStickerLine } from "react-icons/ri";
import { RiSendPlaneFill } from "react-icons/ri";

const MessageBar = () => {
    const emojiRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo } = useAppStore();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef]);

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
        }
        setMessage("");
    };

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-4 mb-2 gap-4">
            <div className="flex-1 flex  bg-[#2a2b33] rounded-md gap-4 pr-4 items-center ">
                <input
                    type="text"
                    className="flex-1 p-3 md:p-4  bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-150 transition-all">
                    <ImAttachment className="text-xl" />
                </button>
                <div className="relative">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-150 transition-all pt-1"
                        onClick={() => setEmojiPickerOpen(true)}
                    >
                        <RiEmojiStickerLine className="text-xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>
            <button
                className="bg-blue-500/50 hover:bg-blue-500/70 focus:bg-blue-400 rounded-md flex items-center justify-center p-3 focus:border-none focus:outline-none focus:text-white duration-150 transition-all"
                onClick={handleSendMessage}
            >
                <RiSendPlaneFill className="text-3xl" />
            </button>
        </div>
    );
};

export default MessageBar;
