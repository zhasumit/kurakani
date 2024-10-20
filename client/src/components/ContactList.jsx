import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        setSelectedChatMessages,
    } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]); // clear previous messages
        }
    };

    return (
        <div className="mt-4">
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-5 py-2 transition-all duration-200 cursor-pointer  border-gray-600 ${
                        selectedChatData && selectedChatData._id === contact._id
                            ? "bg-blue-900/30 hover:bg-blue-900/60"
                            : "hover:bg-blue-900/60"
                    }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-2 items-center justify-start text-neutral-300">
                        {!isChannel && (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                                    {contact.image ? (
                                        <AvatarImage
                                            src={`${HOST}/${contact.image}`}
                                            alt="profile"
                                            className={`${getColor(
                                                contact.color
                                            )} object-cover w-full h-full border-2 rounded-full`}
                                        />
                                    ) : (
                                        <div
                                            className={`uppercase w-10 h-10 text-lg border-2 flex items-center justify-center text-white  rounded-full ${getColor(
                                                contact.color
                                            )}`}
                                        >
                                            {contact.firstName
                                                ? contact.firstName
                                                      .split("")
                                                      .shift()
                                                : contact.email
                                                      .split("")
                                                      .shift()}
                                        </div>
                                    )}
                                </Avatar>
                            </div>
                        )}
                        {isChannel && (
                            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                #
                            </div>
                        )}
                        {isChannel ? (
                            <span>{contact.name}</span>
                        ) : (
                            <span>
                                {contact.firstName && contact.lastName
                                    ? `${contact.firstName} ${contact.lastName}`
                                    : `${contact.email}`}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactList;
