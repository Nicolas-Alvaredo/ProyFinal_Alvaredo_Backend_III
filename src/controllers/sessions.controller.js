import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      req.logger.warning("Register failed: Incomplete values");
      return res.status(400).send({ status: "error", error: "Incomplete values" });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      req.logger.warning(`Register failed: User already exists - ${email}`);
      return res.status(400).send({ status: "error", error: "User already exists" });
    }

    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword
    };

    const result = await usersService.create(user);
    req.logger.info(`User registered: ${email}`);
    res.send({ status: "success", payload: result._id });
  } catch (error) {
    req.logger.error(`Register error: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.logger.warning("Login failed: Incomplete values");
      return res.status(400).send({ status: "error", error: "Incomplete values" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      req.logger.warning(`Login failed: User not found - ${email}`);
      return res.status(404).send({ status: "error", error: "User doesn't exist" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      req.logger.warning(`Login failed: Incorrect password - ${email}`);
      return res.status(400).send({ status: "error", error: "Incorrect password" });
    }

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

    res.cookie('coderCookie', token, { maxAge: 3600000 }).send({
      status: "success",
      message: "Logged in"
    });

    req.logger.info(`User logged in: ${email}`);
  } catch (error) {
    req.logger.error(`Login error: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const current = async (req, res) => {
  try {
    const token = req.cookies['coderCookie'];
    if (!token) {
      req.logger.warning("Current failed: No token provided");
      return res.status(401).send({ status: "error", error: "No token provided" });
    }

    const user = jwt.verify(token, 'tokenSecretJWT');
    req.logger.info(`Current session validated: ${user.email}`);
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Current session error: ${error.message}`);
    return res.status(403).send({ status: "error", error: "Invalid or expired token" });
  }
};

const logout = (req, res) => {
  const token = req.cookies['coderCookie'];
  if (!token) {
    req.logger.info("Logout attempted with no active session");
    return res.status(200).send({ status: "success", message: "No active session" });
  }

  res.clearCookie('coderCookie').send({
    status: "success",
    message: "Logged out successfully"
  });

  req.logger.info("User logged out (protected)");
};

const unprotectedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.logger.warning("Unprotected login failed: Incomplete values");
      return res.status(400).send({ status: "error", error: "Incomplete values" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      req.logger.warning(`Unprotected login failed: User not found - ${email}`);
      return res.status(404).send({ status: "error", error: "User doesn't exist" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      req.logger.warning(`Unprotected login failed: Incorrect password - ${email}`);
      return res.status(400).send({ status: "error", error: "Incorrect password" });
    }

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

    res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({
      status: "success",
      message: "Unprotected Logged in"
    });

    req.logger.info(`Unprotected login: ${email}`);
  } catch (error) {
    req.logger.error(`Unprotected login error: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const unprotectedCurrent = async (req, res) => {
  try {
    const token = req.cookies['unprotectedCookie'];
    if (!token) {
      req.logger.warning("Unprotected current failed: No token provided");
      return res.status(401).send({ status: "error", error: "No token provided" });
    }

    const user = jwt.verify(token, 'tokenSecretJWT');
    req.logger.info(`Unprotected current session validated: ${user.email}`);
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Unprotected current error: ${error.message}`);
    return res.status(403).send({ status: "error", error: "Invalid or expired token" });
  }
};

const unprotectedLogout = (req, res) => {
  const token = req.cookies['unprotectedCookie'];
  if (!token) {
    req.logger.info("Unprotected logout with no active session");
    return res.status(200).send({ status: "success", message: "No active unprotected session" });
  }

  res.clearCookie('unprotectedCookie').send({
    status: "success",
    message: "Unprotected logout successful"
  });

  req.logger.info("User logged out (unprotected)");
};

export default {
  register,
  login,
  current,
  logout,
  unprotectedLogin,
  unprotectedCurrent,
  unprotectedLogout
};
