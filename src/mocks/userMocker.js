import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateUsersMock = async (amount = 50) => {
  const safeAmount = Math.min(amount, 100); // Evita números excesivos

  const hashedPassword = await bcrypt.hash("coder123", 10);
  const roles = ["user", "admin"];

  return Array.from({ length: safeAmount }, () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(roles),
    pets: []
  }));
};

