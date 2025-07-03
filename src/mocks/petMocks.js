import { faker } from '@faker-js/faker';

export const generateMockPet = () => {
  return {
    name: faker.person.firstName(),                 // → Nombre aleatorio
    specie: faker.animal.type(),                    // → Tipo de animal (cat, dog, etc.)
    birthDate: faker.date.past(10).toISOString().split('T')[0],  // → Fecha aleatoria en los últimos 10 años
    adopted: faker.datatype.boolean(),              // → true o false aleatorio
    image: faker.image.url()                        // → URL falsa de imagen
  };
};