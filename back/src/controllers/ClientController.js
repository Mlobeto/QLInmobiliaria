const { Client, Property } = require('../data');

// POST: Crear un cliente
exports.createClient = async (req, res) => {
    try {
        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el cliente', details: error.message });
    }
};

// GET: Obtener todos los clientes
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los clientes', details: error.message });
    }
};

// GET: Obtener un cliente por ID
exports.getClientById = async (req, res) => {
    try {
        const { idClient } = req.params;
        const client = await Client.findByPk(idClient);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente', details: error.message });
    }
};

// PUT: Actualizar un cliente
exports.updateClient = async (req, res) => {
    try {
        const { idClient } = req.params;
        const updated = await Client.update(req.body, { where: { idClient } });
        if (!updated[0]) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cliente', details: error.message });
    }
};
exports.deleteClient = async (req, res) => {
    try {
        const { idClient } = req.params;
        const deleted = await Client.destroy({ where: { idClient } });

        if (!deleted) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cliente', details: error.message });
    }
};