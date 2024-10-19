import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/userModel.js";

export const createChannel = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).send("Admin not found");
        }

        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members not found");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return res.status(201).send({ channel: newChannel });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
};

export const getUserChannels = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });

        return res.status(201).send({ channels });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
};
