import { usersService } from "../services/index.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    req.logger.info("Retrieved all users");
    res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.error(`Error retrieving users: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warning(`User not found: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    req.logger.info(`Retrieved user: ${user.email}`);
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Error retrieving user: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warning(`User not found for update: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    await usersService.update(userId, updateBody);
    req.logger.info(`User updated: ${userId}`);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    req.logger.error(`Error updating user: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    const existingUser = await usersService.getUserById(userId);
    if (!existingUser) {
      req.logger.warning(`User not found: ${userId}`);
      return res.status(404).send({ status: "error", message: "User not found" });
    }

    await usersService.delete(userId);
    req.logger.info(`User deleted: ${userId}`);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    req.logger.error(`Error deleting user: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser
};
