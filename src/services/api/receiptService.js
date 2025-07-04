let receiptData = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const receiptService = {
  async getAll() {
    await delay(300);
    return [...receiptData];
  },

  async getById(id) {
    await delay(200);
    const receipt = receiptData.find(item => item.Id === parseInt(id));
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    return { ...receipt };
  },

  async create(receiptInfo) {
    await delay(500);
    const newReceipt = {
      ...receiptInfo,
      Id: receiptData.length > 0 ? Math.max(...receiptData.map(r => r.Id)) + 1 : 1
    };
    receiptData.push(newReceipt);
    return { ...newReceipt };
  },

  async update(id, updatedData) {
    await delay(400);
    const index = receiptData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Receipt not found');
    }
    receiptData[index] = { ...receiptData[index], ...updatedData };
    return { ...receiptData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = receiptData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Receipt not found');
    }
    const deleted = receiptData.splice(index, 1);
    return deleted[0];
  }
};