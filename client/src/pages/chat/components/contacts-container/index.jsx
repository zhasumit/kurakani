import { useEffect } from "react";
import logo from "../../../../assets/chaticon.png";
import longlogo from "../../../../assets/kurakani.png";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import {
    GET_DM_CONTACTS_ROUTES,
    GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
    const {
        setDirectMessagesContacts,
        directMessagesContacts,
        channels,
        setChannels,
    } = useAppStore();

    useEffect(() => {
        const getContacts = async () => {
            const res = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                withCredentials: true,
            });
            if (res.data.contacts) {
                setDirectMessagesContacts(res.data.contacts);
            }
        };
        const getChannels = async () => {
            const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
                withCredentials: true,
            });
            if (res.data.channels) {
                setChannels(res.data.channels);
            }
        };
        getContacts();
        getChannels();
    }, [setChannels, setDirectMessagesContacts]);

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#080d19] border-r-2 border-[#2f303b] w-full">
            <div className="m-3 flex gap-2 items-center mb-7">
                <img src={logo} className="h-5" alt="" />
                <img src={longlogo} className="h-6" alt="" />
            </div>
            <div className="my-2">
                <div className="flex items-center justify-between pr-5">
                    <Title text="Direct Messages" />
                    <NewDm />
                </div>
                <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
                    <ContactList contacts={directMessagesContacts} />
                </div>
            </div>
            <div className="my-2 mt-10">
                <div className="flex items-center justify-between pr-5">
                    <Title text="Channels" />
                    <CreateChannel />
                </div>
                <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
                    <ContactList contacts={channels} isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    );
};

export default ContactsContainer;

const Title = ({ text }) => {
    return (
        <h3 className="uppercase tracking-widest text-neutral-400 pl-5 font-light text-opacity-90 text-sm">
            {text}
        </h3>
    );
};
