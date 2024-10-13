const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AeJJJXNh8m_ERPCYbqtHEhCWBF4amt3BrxZpa7mzZqBh-uwvv3XHBc2NOPFKoPLuwcdkA_XMC1VEpfOS",
  client_secret:
    "EL2qOBZrpsQ_YBR1vpEJivQgh5qIvXhNsFIODvY7cjPSDyhnA8mXrY5O801-RW9grnyT5M_Fl74dHb2v",
});

module.exports = paypal;
