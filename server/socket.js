import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // set userIds and socket instants (which user to send msg)
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Clint disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        // store the message the db in case offline user are sent
        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    };

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl,
        });

        // get sender details
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();

        // update and add the data to the channel
        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        // get all the members and populate message
        const channel = await Channel.findById(channelId).populate("members");
        const finalData = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                // member online
                if (memberSocketId) {
                    io.to(memberSocketId).emit(
                        "recieve-channel-message",
                        finalData
                    );
                }
            });
            const adminSocketId = userSocketMap.get(
                channel.admin._id.toString()
            );
            // member online
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finalData);
            }
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`user ${userId} connected to ${socket.id}`);
        } else {
            console.log("userId not found");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
