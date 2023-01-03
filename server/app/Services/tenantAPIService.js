
const { now } = require("moment/moment");
const db = require("../models");
const tenant = db.tenant;

exports.getTenantInfo = async (tenantId) => {
   return await tenant.findOne({ where: { id: tenantId } });
}
exports.createTenant = async (name) => {
   const obj = {
      name: name,
      max_user: 10,
      is_active: true,
      last_login_dt: now()
   }
   return await tenant.create(obj);
}

exports.findTenantByName = async (name) => {
   try {      
      const resp = await tenant.findOne({ where: { name: name } });
      console.log("Jatin",resp);
      return resp;
      
   } catch (error) {
          return "Error Message";      
   }
}
