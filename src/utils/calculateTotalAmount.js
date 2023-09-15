function calculateTotalAmount(invoice) {
  return invoice.leadAmount-invoice.discount
}

module.exports = calculateTotalAmount;
