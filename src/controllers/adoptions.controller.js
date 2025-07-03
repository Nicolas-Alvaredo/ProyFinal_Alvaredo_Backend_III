import { adoptionsService, petsService, usersService } from "../services/index.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();
    req.logger.info("Retrieved all adoptions");
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error retrieving adoptions: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption) {
      req.logger.warning(`Adoption not found: ${adoptionId}`);
      return res.status(404).send({ status: "error", error: "Adoption not found" });
    }
    req.logger.info(`Retrieved adoption: ${adoptionId}`);
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    req.logger.error(`Error retrieving adoption: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const user = await usersService.getUserById(uid);
    if (!user) {
      req.logger.warning(`User not found: ${uid}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    const pet = await petsService.getBy({ _id: pid });
    if (!pet) {
      req.logger.warning(`Pet not found: ${pid}`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    if (pet.adopted) {
      req.logger.warning(`Pet already adopted: ${pid}`);
      return res.status(400).send({ status: "error", error: "Pet is already adopted" });
    }

    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });

    req.logger.info(`Pet ${pid} adopted by user ${uid}`);
    res.send({ status: "success", message: "Pet adopted" });
  } catch (error) {
    req.logger.error(`Error in createAdoption: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption
};
