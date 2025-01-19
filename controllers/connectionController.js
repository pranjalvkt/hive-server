const Connection = require("../models/connectionModel");
const User = require("../models/userModel");

const sendFriendRequest = async (req, res) => {
  const senderId = req.params?.id; // The logged-in user (sender)
  const { receiverId } = req.body; // The receiver who will receive the request

  try {
    // Check if both users exist
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Check if there's already a pending or accepted request between sender and receiver
    const existingConnection = await Connection.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Request already sent or accepted." });
    }

    // Create a new connection with a "pending" status
    const newConnection = new Connection({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    await newConnection.save();
    return res
      .status(200)
      .json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const receiverId = req.params?.id; // The logged-in user (receiver)
  const { connectionId } = req.body; // Connection ID to accept

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }

    if (connection.receiver.toString() !== receiverId) {
      return res
        .status(400)
        .json({ message: "You are not the receiver of this request." });
    }

    // Change the status of the connection to 'accepted'
    connection.status = "accepted";
    await connection.save();

    return res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectFriendRequest = async (req, res) => {
  const receiverId = req.params?.id; // The logged-in user (receiver)
  const { connectionId } = req.body; // Connection ID to reject

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }

    if (connection.receiver.toString() !== receiverId) {
      return res
        .status(400)
        .json({ message: "You are not the receiver of this request." });
    }

    // Delete the connection if it's rejected
    await connection.remove();

    return res.status(200).json({ message: "Friend request rejected." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchPendingRequests = async (req, res) => {
  const receiverId = req.params?.id;

  try {
    // Fetch all connections where the logged-in user is the receiver and the status is 'pending'
    const pendingConnections = await Connection.find({
      receiver: receiverId,
      status: "pending",
    })
      .populate("sender", "fullName email profilePic") // Populate sender details to show who sent the request
      .exec();

    if (!pendingConnections || pendingConnections.length === 0) {
      return res.status(200).json({ message: "No pending friend requests.", pendingRequests: [] });
    }

    res.status(200).json({
      pendingRequests: pendingConnections.map((connection) => ({
        connectionId: connection._id,
        sender: connection.sender,
        status: connection.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const fetchSentRequests = async (req, res) => {
  const senderId = req.params?.id; // The logged-in user (sender)

  try {
    // Fetch all connections where the logged-in user is the sender and the request is pending
    const sentConnections = await Connection.find({
      sender: senderId,
      status: "pending",
    })
      .populate("receiver", "fullName email profilePic") // Populate receiver details
      .exec();

    if (!sentConnections || sentConnections.length === 0) {
      return res.status(200).json({ message: "No sent requests found.", sentRequests: [] });
    }

    const sentRequests = sentConnections.map((connection) => ({
      connectionId: connection._id,
      receiver: connection.receiver,
      status: connection.status,
    }));

    res.status(200).json({
      sentRequests: sentRequests,
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const fetchAcceptedRequests = async (req, res) => {
  const senderId = req.params?.id; // The logged-in user (sender)

  try {
    // Fetch all connections where the logged-in user is the sender and the request is accepted
    const acceptedConnections = await Connection.find({
      sender: senderId,
      status: "accepted",
    })
      .populate("receiver", "fullName email profilePic") // Populate receiver details
      .exec();

    if (!acceptedConnections || acceptedConnections.length === 0) {
      return res.status(200).json({ message: "No accepted requests found.", acceptedRequests: [] });
    }

    const acceptedRequests = acceptedConnections.map((connection) => ({
      connectionId: connection._id,
      receiver: connection.receiver,
      status: connection.status,
    }));

    res.status(200).json({
      acceptedRequests: acceptedRequests,
    });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const fetchAvailableUsers = async (req, res) => {
  const loggedInUserId = req?.params?.id; // The logged-in user's ID

  try {
    // Step 1: Fetch all users except the logged-in user
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } });

    if (!allUsers || allUsers.length === 0) {
      return res.status(200).json({ message: "No users available.", availableUsers: [] });
    }

    // Step 2: Fetch all connections (both accepted and pending) of the logged-in user
    const connections = await Connection.find({
      $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }],
      status: { $in: ["pending", "accepted"] }, // Only fetch accepted or pending connections
    });

    // Step 3: Filter out users who are part of these connections
    const connectedUserIds = connections.map((connection) => {
      return connection.sender.toString() === loggedInUserId
        ? connection.receiver.toString()
        : connection.sender.toString();
    });

    // Step 4: Exclude the connected users from the available users list
    const availableUsers = allUsers.filter(
      (user) => !connectedUserIds.includes(user._id.toString())
    );

    res.status(200).json({
      availableUsers,
    });
  } catch (error) {
    console.error("Error fetching available users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchPendingRequests,
  fetchSentRequests,
  fetchAcceptedRequests,
  fetchAvailableUsers,
};
