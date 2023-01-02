const db = require("../models");
const fix_version = db.fix_version;
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");

exports.CreateFixVersion = async (
  fixversion,
  is_active,
  project,
  ticket_id,
  user_id,
  tenant_id,
  id
) => {
  const body = {
    fixversion: fixversion,
    is_active: is_active,
    project: project,
    ticket_id: ticket_id,
    user_id: user_id,
    tenantId: tenant_id,
  };
  if (
    (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id)) !== null
  ) {
    body.id = id;
    body.is_active = is_active;
    return await fix_version.update(body, { where: { id: id } });
  } else {
    return await fix_version.create(body);
  }
};

exports.getPaginationVersion = async (page, size, tenantId) => {
  let response = null;
  const { limit, offset } = await generalMethodService.getPagination(
    page,
    size
  );
  await fix_version
    .findAndCountAll({ limit, offset, where: { tenantId: tenantId } })
    .then(async (data) => {
      const res = await generalMethodService.getPagingData(data, page, limit);
      response = res;
    });
  return response;
};

exports.getVersionById = async (id, tenantId) => {
  return await fix_version.findOne({
    where: { [Op.and]: [{ id: id }, { tenantId: tenantId }] },
  });
};
