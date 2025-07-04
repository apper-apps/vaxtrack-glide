let lossData = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const lossService = {
  async getAll() {
    await delay(300);
    return [...lossData];
  },

  async getById(id) {
    await delay(200);
    const loss = lossData.find(item => item.Id === parseInt(id));
    if (!loss) {
      throw new Error('Loss record not found');
    }
    return { ...loss };
  },

  async create(lossInfo) {
    await delay(500);
    const newLoss = {
      ...lossInfo,
      Id: lossData.length > 0 ? Math.max(...lossData.map(l => l.Id)) + 1 : 1
    };
    lossData.push(newLoss);
    return { ...newLoss };
  },

  async update(id, updatedData) {
    await delay(400);
    const index = lossData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Loss record not found');
    }
    lossData[index] = { ...lossData[index], ...updatedData };
    return { ...lossData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = lossData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Loss record not found');
    }
    const deleted = lossData.splice(index, 1);
    return deleted[0];
  }
};