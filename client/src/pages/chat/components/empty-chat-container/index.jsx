import duck from "../../../../assets/duck.gif";
const EmptyChatContainer = () => {
    return (
        <div className="flex-1 md:bg-[#060f1e] sm:hidden md:flex flex-col justify-center items-center  duration-500 transition-all">
            <img src={duck} className="h-[25vh]" />
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-4 lg:text-3xl text-2xl transition-all duration-300 text-center">
                <h2 className="text-xl tracking-tighter">
                    Hi<span className="text-blue-200">!</span> Welcome to
                    <span className="text-blue-200"> kurakani</span> chat app
                </h2>
            </div>
        </div>
    );
};

export default EmptyChatContainer;
