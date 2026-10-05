const { Router } = require('express');
const router = Router();

const { LeadsSchema } = require('../Validations/leads.Validations');
const validationMiddleware = require('../lib/middlewares/validation.middleware');
const TokenAuthMiddleware = require('../lib/middlewares/TokenAuth.middleware');
const {
  getLeads,
  updateLeads,
  createLead,
  deleteLeads,
} = require('../Controllers/leads.controller');

router.get('/', getLeads);
router.put('/', updateLeads);
router.post('/', TokenAuthMiddleware, validationMiddleware(LeadsSchema), createLead);
router.delete('/', deleteLeads);

module.exports = router;
