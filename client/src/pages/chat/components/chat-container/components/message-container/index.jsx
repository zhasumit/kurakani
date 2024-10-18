import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
    const scrollRef = useRef();
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        selectedChatMessages,
        setSelectedChatMessages,
    } = useAppStore();

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await apiClient.post(
                    GET_ALL_MESSAGES_ROUTE,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                );
                if (res.data.messages) {
                    setSelectedChatMessages(res.data.messages);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (selectedChatData._id) {
            if (selectedChatType === "contact") getMessages();
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages]);

    const renderMessages = () => {
        let lastDate = null;
        // render date for one day only once
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-gray-500 my-2">
                            {moment(message.timestamp).format("LL")}
                        </div>
                    )}
                    {selectedChatType === "contact" &&
                        renderDMMessages(message)}
                </div>
            );
        });
    };

    const renderDMMessages = (message) => (
        <div
            className={`${
                message.sender === selectedChatData._id
                    ? "text-left"
                    : "text-right"
            } mb-2`}
        >
            {message.messageType === "text" && (
                <div
                    className={`${
                        message.sender !== selectedChatData._id
                            ? "bg-blue-600/60 text-[#white]/90 border-none text-left rounded-ee-2xl rounded-s-2xl"
                            : "bg-[#2a2b33]/40 text-white/80  border-none text-right rounded-e-2xl rounded-es-2xl"
                    } border inline-block p-1 px-3 rounded my-1 max-w-[50%] break-words`}
                >
                    {message.content}
                </div>
            )}
            <div className="text-xs text-gray-600">
                {moment(message.timestamp).format("LT")}
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 px-6 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full">
            {renderMessages()}
            <div ref={scrollRef} />
        </div>
    );
};

export default MessageContainer;
