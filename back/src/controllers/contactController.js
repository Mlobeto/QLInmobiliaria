const { Contacto } = require('../data'); 
const { sendEmail } = require('../emailService');

// Controlador para crear un nuevo contacto
exports.createContact = async (req, res) => {
  const { name, email, phone, isSuscripto, message } = req.body;

  try {
    // Buscar si el usuario ya está registrado y suscripto
    const existingContact = await Contacto.findOne({ where: { email } });

    if (existingContact) {
      if (existingContact.isSuscripto) {
        // Si ya está suscripto, solo enviamos el mensaje al admin sin crear un nuevo registro
        await sendEmail({ name, email, phone, isSuscripto, message }, true);
        return res.status(200).json({ message: 'Gracias por tu mensaje. Te responderemos pronto.' });
      } else {
        // Si no está suscripto, creamos el contacto y enviamos el mensaje
        const newContact = await Contacto.create({ name, email, phone, isSuscripto, message });
        await sendEmail({ name, email, phone, isSuscripto, message }, true);
        return res.status(201).json({ message: 'Contacto registrado con éxito', contact: newContact });
      }
    }

    // Si el contacto no existe, lo creamos
    const newContact = await Contacto.create({ name, email, phone, isSuscripto, message });
    await sendEmail({ name, email, phone, isSuscripto, message }, true);
    return res.status(201).json({ message: 'Contacto registrado con éxito', contact: newContact });
    
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el contacto', error: error.message });
  }
};

// Controlador para obtener todos los contactos (opcional)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contacto.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener contactos', error: error.message });
  }
};
