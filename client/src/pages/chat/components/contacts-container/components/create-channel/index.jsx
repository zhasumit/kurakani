import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
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
import {
    CREATE_CHANNEL_ROUTE,
    GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
    const { setSelectedChatType, setSelectedChatData, addChannel } =
        useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const res = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
                withCredentials: true,
            });
            setAllContacts(res.data.contacts);
        };
        getData();
    }, []);

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const res = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: channelName,
                        members: selectedContacts.map(
                            (contact) => contact.value
                        ),
                    },
                    { withCredentials: true }
                );
                if (res.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(res.data.channel);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FiPlus
                            className="text-neutral-400 font-semibold text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-200"
                            onClick={() => setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1a1c24] text-white mb-1 border-none">
                        Create new channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[80vw] h-[70vh] flex flex-col rounded-sm">
                    <DialogHeader>
                        <DialogTitle>Fill new channel details</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel name"
                            className="rounded-lg p-3 bg-[#232e3b] border-none"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600">
                                    No contacts found
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-blue-700/70 hover:bg-blue-800 transition-all duration-200"
                            onClick={createChannel}
                        >
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannel;
