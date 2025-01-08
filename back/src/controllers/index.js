const { catchedAsync } = require("../utils");
const authController = require("./authController"); // Importamos el archivo de controladores de auth
const ClientController = require("./clientController")
const LeaseController = require("./LeaseController")
const PaymentController = require ("./PaymentController")
const PropertyController = require ("./PropertyController")
const garantorController = require ("./garantorController")
const addPropertyToClientWithRole = require ("./addPropertyToClientWithRole")

module.exports = {
  register: catchedAsync(authController.register),  
  login: catchedAsync(authController.login),
  getAllAdmins: catchedAsync(authController.getAllAdmins),
  editAdmin: catchedAsync(authController.editAdmin),
  deleteAdmin: catchedAsync(authController.deleteAdmin),
  createClient:catchedAsync(ClientController.createClient),
  getAllClients:catchedAsync(ClientController.getAllClients),
  getClientById:catchedAsync(ClientController.getClientById),
  updateClient:catchedAsync(ClientController.updateClient),
  deleteClient: catchedAsync(ClientController.deleteClient),
  createLease: catchedAsync(LeaseController.createLease),
  getLeasesByIdClient: catchedAsync(LeaseController.getLeasesByIdClient),
  terminateLease: catchedAsync(LeaseController.terminateLease),
  createPayment: catchedAsync(PaymentController.  createPayment) ,
  getPaymentsByIdClient: catchedAsync(PaymentController.getPaymentsByIdClient),
  getPaymentsByLeaseId: catchedAsync(PaymentController.getPaymentsByLeaseId),
  createProperty: catchedAsync(PropertyController.createProperty),
  getAllProperties: catchedAsync(PropertyController.getAllProperties),
  getPropertiesByIdClient: catchedAsync(PropertyController.getPropertiesByIdClient),
  getPropertiesByType: catchedAsync(PropertyController.getPropertiesByType),
  deleteProperty: catchedAsync(PropertyController.deleteProperty),
  updateProperty: catchedAsync(PropertyController.updateProperty),
  getFilteredProperties: catchedAsync(PropertyController.getFilteredProperties),
  createGarantorsForLease: catchedAsync(garantorController.createGarantorsForLease),
  updateGarantor:catchedAsync(garantorController.updateGarantor),
  getGarantorsByLeaseId: catchedAsync(garantorController.getGarantorsByLeaseId),
  addPropertyToClientWithRole : catchedAsync(addPropertyToClientWithRole.addPropertyToClientWithRole),
  getAllProperties: catchedAsync(PropertyController.getAllProperties),
};