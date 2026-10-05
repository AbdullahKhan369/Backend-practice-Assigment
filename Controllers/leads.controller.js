const { getDB } = require("../lib/helpers/db");

const getLeads = (req, res) => {
  res.send('Hello World! this is GET from Leads');
}

const updateLeads = (req, res) => {
  res.send('Hello World! this is PUT from Leads');
}

const createLead = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const createdby = req.user.email; // TokenAuth middleware ne set kiya h
    const db = getDB();

    await db.collection("leads").insertOne({
      name,
      email,
      phone,
      createdby,
    });

    res.status(201).send({ message: "Lead saved in mongo db", lead: { name, email, phone } });
  } catch (error) {
    console.log("Create lead error:", error)
    res.status(500).send({ message: "Something went wrong" })
  }
}

const deleteLeads = (req, res) => {
  res.send('Hello World! this is DELETE from Leads');
}

module.exports = { getLeads, updateLeads, createLead, deleteLeads }
