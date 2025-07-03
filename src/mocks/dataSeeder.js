import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateAndInsertData = async ({ users = 0, pets = 0 }, usersService, petsService) => {
  const hashedPassword = await bcrypt.hash("coder123", 10);
  const roles = ["user", "admin"];

  const userDocs = Array.from({ length: users }, () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(roles),
    pets: []
  }));

  const savedUsers = await usersService.createMany(userDocs);

  const userIds = savedUsers.map(u => u._id);
  const petDocs = Array.from({ length: pets }, () => ({
    name: faker.person.firstName(),
    specie: faker.animal.type(),
    birthDate: faker.date.past(10),
    adopted: true,
    owner: faker.helpers.arrayElement(userIds)
  }));

  await petsService.createMany(petDocs);
};
