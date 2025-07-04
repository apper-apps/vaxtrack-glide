import vaccineData from '@/services/mockData/vaccines.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const vaccineService = {
  async getAll() {
    await delay(300);
    return [...vaccineData];
  },

  async getById(id) {
    await delay(200);
    const vaccine = vaccineData.find(item => item.Id === parseInt(id));
    if (!vaccine) {
      throw new Error('Vaccine not found');
    }
    return { ...vaccine };
  },

  async create(vaccineData) {
    await delay(500);
    const newVaccine = {
      ...vaccineData,
      Id: Math.max(...vaccineData.map(v => v.Id)) + 1
    };
    vaccineData.push(newVaccine);
    return { ...newVaccine };
  },

  async update(id, updatedData) {
    await delay(400);
    const index = vaccineData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Vaccine not found');
    }
    vaccineData[index] = { ...vaccineData[index], ...updatedData };
    return { ...vaccineData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = vaccineData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Vaccine not found');
    }
    const deleted = vaccineData.splice(index, 1);
    return deleted[0];
  }
};