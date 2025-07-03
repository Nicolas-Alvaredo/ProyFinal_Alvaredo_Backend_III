import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    req.logger.info("Retrieved all pets");
    res.send({ status: "success", payload: pets });
  } catch (error) {
    req.logger.error(`Error retrieving pets: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res.status(400).send({ status: "error", error: "Incomplete values" });

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    req.logger.info(`Created pet: ${result._id}`);
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error creating pet: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const updatePet = async (req, res) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    await petsService.update(petId, petUpdateBody);
    req.logger.info(`Updated pet: ${petId}`);
    res.send({ status: "success", message: "Pet updated" });
  } catch (error) {
    req.logger.error(`Error updating pet: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    await petsService.delete(petId);
    req.logger.info(`Deleted pet: ${petId}`);
    res.send({ status: "success", message: "Pet deleted" });
  } catch (error) {
    req.logger.error(`Error deleting pet: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate)
      return res.status(400).send({ status: "error", error: "Incomplete values" });

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`
    });

    const result = await petsService.create(pet);
    req.logger.info(`Created pet with image: ${result._id}`);
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error creating pet with image: ${error.message}`);
    res.status(500).send({ status: "error", error: "Internal error" });
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage
};
