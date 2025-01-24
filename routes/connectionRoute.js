const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchPendingRequests,
  fetchSentRequests,
  fetchAcceptedRequests,
  fetchAvailableUsers,
  getAcceptedConnections,
  removeFriend,
} = require("../controllers/connectionController");

const authenticateToken = require("../middleware/authenticateToken");

router.post("/send", authenticateToken, sendFriendRequest);
router.post("/accept", authenticateToken, acceptFriendRequest);
router.post("/reject", authenticateToken, rejectFriendRequest);
router.get("/pending-requests", authenticateToken, fetchPendingRequests);
router.get("/sent-requests", authenticateToken, fetchSentRequests);
router.get("/accepted-requests", authenticateToken, fetchAcceptedRequests);
router.get("/available-users", authenticateToken, fetchAvailableUsers);
router.get("/all-connections", authenticateToken, getAcceptedConnections);
router.post("/remove-connection", authenticateToken, removeFriend);

module.exports = router;
