import inventoryData from '@/services/mockData/inventory.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryService = {
  async getAll() {
    await delay(300);
    return [...inventoryData];
  },

  async getById(id) {
    await delay(200);
    const item = inventoryData.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error('Inventory item not found');
    }
    return { ...item };
  },

  async create(itemData) {
    await delay(500);
    const newItem = {
      ...itemData,
      Id: Math.max(...inventoryData.map(i => i.Id)) + 1
    };
    inventoryData.push(newItem);
    return { ...newItem };
  },

  async update(id, updatedData) {
    await delay(400);
    const index = inventoryData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    inventoryData[index] = { ...inventoryData[index], ...updatedData };
    return { ...inventoryData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = inventoryData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    const deleted = inventoryData.splice(index, 1);
    return deleted[0];
  }
};