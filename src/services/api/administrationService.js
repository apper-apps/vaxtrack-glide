let administrationData = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const administrationService = {
  async getAll() {
    await delay(300);
    return [...administrationData];
  },

  async getById(id) {
    await delay(200);
    const admin = administrationData.find(item => item.Id === parseInt(id));
    if (!admin) {
      throw new Error('Administration record not found');
    }
    return { ...admin };
  },

  async create(adminData) {
    await delay(500);
    const newAdmin = {
      ...adminData,
      Id: administrationData.length > 0 ? Math.max(...administrationData.map(a => a.Id)) + 1 : 1
    };
    administrationData.push(newAdmin);
    return { ...newAdmin };
  },

  async update(id, updatedData) {
    await delay(400);
    const index = administrationData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Administration record not found');
    }
    administrationData[index] = { ...administrationData[index], ...updatedData };
    return { ...administrationData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = administrationData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Administration record not found');
    }
    const deleted = administrationData.splice(index, 1);
    return deleted[0];
  }
};