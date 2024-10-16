import duck from "@/assets/duck.gif";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

const NewDm = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const res = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (res.status === 200 && res.data.contacts) {
                    setSearchedContacts(res.data.contacts);
                } else {
                    setSearchedContacts([]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FiPlus
                            className="text-neutral-400 font-semibold text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-200"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1a1c24] text-white mb-1 border-none">
                        new chat
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog
                open={openNewContactModal}
                onOpenChange={setOpenNewContactModal}
            >
                <DialogContent className="bg-[#181920] border-none text-white w-[80vw] h-[70vh] flex flex-col rounded-sm">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="contact name"
                            className="rounded-lg p-3 bg-[#232e3b] border-none"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {searchedContacts.length > 0 && (
                        <ScrollArea className="h-[48vh]">
                            <div className="flex flex-col gap-3">
                                {searchedContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className="flex gap-3 items-center cursor-pointer"
                                        onClick={() =>
                                            selectNewContact(contact)
                                        }
                                    >
                                        <div className="w-12 h-12 relative ">
                                            <Avatar className="h-12 w-12  rounded-full overflow-hidden">
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
                                                        className={`uppercase w-12 h-12 text-lg border-2 flex items-center justify-center text-white  rounded-full ${getColor(
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
                                        <div className="flex flex-col">
                                            <span>
                                                {contact.firstName &&
                                                contact.lastName
                                                    ? `${contact.firstName} ${contact.lastName}`
                                                    : `${contact.email}`}
                                            </span>
                                            <span className="text-xs">
                                                {contact.email}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                    {searchedContacts.length <= 0 && (
                        <div className="flex flex-col justify-center items-center mt-[10vh]  duration-500 transition-all">
                            <img src={duck} className="h-[15vh]" />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center lg:text-2xl text-lg transition-all duration-300 text-center">
                                <h2 className=" tracking-tighter">
                                    search
                                    <span className="text-blue-400"> new </span>
                                    contact
                                </h2>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NewDm;
