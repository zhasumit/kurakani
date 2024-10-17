import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
    const scrollRef = useRef();
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        selectedChatMessages,
    } = useAppStore();

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
            } mb-3`}
        >
            {message.messageType === "text" && (
                <div
                    className={`${
                        message.sender !== selectedChatData._id
                            ? "bg-[#8417ff]/60 text-[#white]/90 border-none text-left"
                            : "bg-[#2a2b33]/40 text-white/80  border-none text-right"
                    } border inline-block p-1 px-4 rounded my-1 max-w-[50%] break-words`}
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
