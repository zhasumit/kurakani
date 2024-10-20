import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { getChatColor, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { BsFillFileEarmarkZipFill } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const MessageContainer = () => {
    const [hoveredFileId, setHoveredFileId] = useState(null); // Use _id to track hovered file

    const scrollRef = useRef();
    const {
        selectedChatType,
        selectedChatData,
        userInfo,
        selectedChatMessages,
        setSelectedChatMessages,
        setIsDownloading,
        setFileDownloadProgress,
    } = useAppStore();
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                setShowImage(false);
                setImageURL(null);
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [setShowImage, setImageURL]);

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

    const checkIfImage = (filePath) => {
        const imageRegex =
            /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    };

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
                    {selectedChatType === "channel" &&
                        renderChannelMessages(message)}
                </div>
            );
        });
    };

    const downloadFile = async (url) => {
        setIsDownloading(true);
        setFileDownloadProgress(0);
        const res = await apiClient.get(`${HOST}/${url}`, {
            responseType: "blob",
            onDownloadProgress: (progress) => {
                const { loaded, total } = progress;
                const percentCompleted = Math.round((loaded / total) * 100);
                setFileDownloadProgress(percentCompleted);
            },
        });
        // create a temp a link and then make it active after adding to document and then revoke it
        const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
        setIsDownloading(false);
        setFileDownloadProgress(0);
    };

    const renderDMMessages = (message) => (
        <div
            className={`${
                message.sender === selectedChatData._id
                    ? "text-left"
                    : "text-right"
            } mb-1`}
        >
            {message.messageType === "text" && (
                <div
                    className={`${
                        message.sender !== selectedChatData._id
                            ? `${getChatColor(
                                  userInfo.color
                              )} text-[#white]/90 border-2 text-left rounded-ee-2xl rounded-s-2xl`
                            : ` bg-[#2a2b33]/40 border-[#2a2b44] text-white/80 border-2 rounded-e-2xl rounded-es-2xl`
                    } border inline-block p-[6px] px-4 rounded my-1 max-w-[50%] break-words`}
                >
                    {message.content}
                </div>
            )}
            {message.messageType === "file" && (
                <div
                    className={`${
                        message.sender !== selectedChatData._id
                            ? `${getChatColor(
                                  userInfo.color
                              )} text-[#white]/90 border-2 text-left rounded-ee-2xl rounded-s-2xl`
                            : ` bg-[#2a2b33]/40 border-[#2a2b44] text-white/80 border-2 text-right rounded-e-2xl rounded-es-2xl`
                    } border inline-block p-[6px] rounded my-1 max-w-[50%] break-words`}
                >
                    {checkIfImage(message.fileUrl) ? (
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setShowImage(true);
                                setImageURL(message.fileUrl);
                            }}
                        >
                            <img
                                src={`${HOST}/${message.fileUrl}`}
                                height={300}
                                width={300}
                                alt="file"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 duration-200 transition-all">
                            <span
                                onMouseEnter={() =>
                                    setHoveredFileId(message._id)
                                }
                                onMouseLeave={() => setHoveredFileId(null)}
                                className="text-white/80 text-2xl bg-black/20 rounded-full p-3 duration-200 transition-all hover:bg-black/50"
                                onClick={() => downloadFile(message.fileUrl)}
                            >
                                {hoveredFileId === message._id ? ( // Show download icon only for hovered file
                                    <HiDownload />
                                ) : (
                                    <BsFillFileEarmarkZipFill />
                                )}
                            </span>
                            <span>{message.fileUrl.split("/").pop()}</span>
                        </div>
                    )}
                </div>
            )}
            <div className="text-xs text-gray-600">
                {moment(message.timestamp).format("LT")}
            </div>
        </div>
    );

    const renderChannelMessages = (message) => {
        return (
            <div
                className={`mt-3 ${
                    message.sender._id !== userInfo.id
                        ? "text-left"
                        : "text-right"
                }`}
            >
                {message.sender._id !== userInfo.id ? (
                    <div className="flex items-center justify-start gap-1 tracking-tight">
                        <Avatar className="h-5 w-5  rounded-full overflow-hidden -ml-2">
                            {message.sender.image ? (
                                <AvatarImage
                                    src={`${HOST}/${message.sender.image}`}
                                    alt="profile"
                                    className={`${getColor(
                                        message.sender.color
                                    )} object-cover w-full h-full border-2 rounded-full`}
                                />
                            ) : (
                                <div
                                    className={`uppercase w-5 h-5 text-xs border-2 flex items-center justify-center text-white rounded-full ${getColor(
                                        message.sender.color
                                    )}`}
                                >
                                    {message.sender.firstName
                                        ? message.sender.firstName
                                              .split("")
                                              .shift()
                                        : message.sender.email
                                              .split("")
                                              .shift()}
                                </div>
                            )}
                        </Avatar>
                        <span className={`text-sm text-neutral-400`}>
                            {message.sender.firstName && message.sender.lastName
                                ? `${message.sender.firstName} ${message.sender.lastName}`
                                : `${message.sender.email}`}
                        </span>
                        <span className="text-xs text-neutral-500">
                            {moment(message.timestamp).format("LT")}
                        </span>
                    </div>
                ) : (
                    <div>
                        <span className={`text-sm text-neutral-400`}>You </span>
                        <span className="text-xs text-neutral-500">
                            {moment(message.timestamp).format("LT")}
                        </span>
                    </div>
                )}

                {message.messageType === "file" && (
                    <div
                        className={`${
                            message.sender._id === userInfo.id
                                ? `${getChatColor(
                                      userInfo.color
                                  )} text-[#white]/90 border-2 text-left rounded-ee-2xl rounded-s-2xl`
                                : ` bg-[#2a2b33]/40 border-[#2a2b44] text-white/80 border-2 text-right rounded-e-2xl rounded-es-2xl`
                        } border inline-block p-[6px] rounded my-1 max-w-[50%] break-words`}
                    >
                        {checkIfImage(message.fileUrl) ? (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(true);
                                    setImageURL(message.fileUrl);
                                }}
                            >
                                <img
                                    src={`${HOST}/${message.fileUrl}`}
                                    height={300}
                                    width={300}
                                    alt="file"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 duration-200 transition-all">
                                <span
                                    onMouseEnter={() =>
                                        setHoveredFileId(message._id)
                                    }
                                    onMouseLeave={() => setHoveredFileId(null)}
                                    className="text-white/80 text-2xl bg-black/20 rounded-full p-3 duration-200 transition-all hover:bg-black/50"
                                    onClick={() =>
                                        downloadFile(message.fileUrl)
                                    }
                                >
                                    {hoveredFileId === message._id ? ( // Show download icon only for hovered file
                                        <HiDownload />
                                    ) : (
                                        <BsFillFileEarmarkZipFill />
                                    )}
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                            </div>
                        )}
                    </div>
                )}

                {message.messageType === "text" && (
                    <div
                        className={`${
                            message.sender._id === userInfo.id
                                ? `${getChatColor(
                                      userInfo.color
                                  )} text-[#white]/90 border-2 text-left rounded-ee-2xl rounded-s-2xl`
                                : ` bg-[#2a2b33]/40 border-[#2a2b44] text-white/80 border-2 rounded-e-2xl rounded-es-2xl`
                        } border inline-block p-[6px] px-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {message.content}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 px-6 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full">
            {renderMessages()}
            <div ref={scrollRef} />
            {showImage && (
                <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex  items-center justify-center backdrop-blur-md flex-col">
                    <div>
                        <img
                            src={`${HOST}/${imageURL}`}
                            className="h-[80vh] w-full bg-cover"
                        />
                    </div>
                    <div className="flex gap-3 fixed top-0 right-8 mt-5">
                        <button
                            className="text-white/80 text-2xl bg-black/20 rounded-full p-3 duration-200 transition-all hover:bg-black/50"
                            onClick={() => downloadFile(imageURL)}
                        >
                            <HiDownload />
                        </button>
                        <button
                            className="text-white/80 text-2xl bg-black/20 rounded-full p-3 duration-200 transition-all hover:bg-black/50"
                            onClick={() => {
                                setShowImage(false);
                                setImageURL(null);
                            }}
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageContainer;
