import logo from "../../../../assets/chaticon.png";
import longlogo from "../../../../assets/kurakani.png";
import ProfileInfo from "./components/profile-info";
const ContactsContainer = () => {
    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#080d19] border-r-2 border-[#2f303b] w-full">
            <div className="m-3 flex gap-2 items-center mb-7">
                <img src={logo} className="h-5" alt="" />
                <img src={longlogo} className="h-6" alt="" />
            </div>
            <div className="my-4">
                <div className="flex items-center justify-between pr-5">
                    <Title text="Direct Messages" />
                </div>
            </div>
            <div className="my-4">
                <div className="flex items-center justify-between pr-5">
                    <Title text="Channels" />
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
