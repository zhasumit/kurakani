import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    return (
        <div className="h-[9vh] border-b-2  border-[#2f303b] flex items-center justify-between px-5">
            <div className="flex gap-5 items-center w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                    <div className="w-10 h-10 relative ">
                        <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                            {selectedChatData.image ? (
                                <AvatarImage
                                    src={`${HOST}/${selectedChatData.image}`}
                                    alt="profile"
                                    className={`${getColor(
                                        selectedChatData.color
                                    )} object-cover w-full h-full border-2 rounded-full`}
                                />
                            ) : (
                                <div
                                    className={`uppercase w-10 h-10 text-lg border-2 flex items-center justify-center text-white  rounded-full ${getColor(
                                        selectedChatData.color
                                    )}`}
                                >
                                    {selectedChatData.firstName
                                        ? selectedChatData.firstName
                                              .split("")
                                              .shift()
                                        : selectedChatData.email
                                              .split("")
                                              .shift()}
                                </div>
                            )}
                        </Avatar>
                    </div>
                    {selectedChatType === "contact" && (
                        <span>
                            {selectedChatData.firstName &&
                            selectedChatData.lastName
                                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                : `${selectedChatData.email}`}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-center gap-5">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-150 transition-all"
                        onClick={closeChat}
                    >
                        ✖
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
