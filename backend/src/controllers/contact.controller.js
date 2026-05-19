import Contact from "../models/Contact.js";

// CREATE — public
const createContactController = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;
        if (!firstName || !lastName || !email || !message) {
            throw new Error("firstName, lastName, email, and message are required", { cause: { statusCode: 400 } });
        }
        const contact = await Contact.create({ firstName, lastName, email, phone, message });
        res.status(201).json({ success: true, message: "Message sent successfully", contact });
    } catch (err) {
        next(err);
    }
};

// GET ALL — admin
const getContactsController = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, contacts });
    } catch (err) {
        next(err);
    }
};

// DELETE — admin
const deleteContactController = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) throw new Error("Contact not found", { cause: { statusCode: 404 } });
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};

export { createContactController, getContactsController, deleteContactController };
