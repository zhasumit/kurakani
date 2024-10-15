import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
    return (
        <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1a1c24] flex flex-col md:static md:flex-1">
            <ChatHeader />
            <MessageContainer />
            <MessageBar />
        </div>
    );
};

export default ChatContainer;
