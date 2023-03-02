const currencyHelper = {
  formatCurrency: (value = 0) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
};

export default currencyHelper;