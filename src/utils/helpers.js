const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  return {
    data: array.slice(startIndex, startIndex + limit),
    pagination: { currentPage: page, totalPages: Math.ceil(array.length / limit), totalItems: array.length, itemsPerPage: limit }
  };
};

module.exports = { formatDate, generateId, paginate };
