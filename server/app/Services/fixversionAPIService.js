const db = require("../models");
const fix_version = db.fix_version;
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");

exports.CreateFixVersion = async (
  fixversion,
  is_active,
  tenant_id,
  project_id,
  id
) => {
  const body = {
    fix_version: fixversion,
    is_active: is_active,
    tenant_id: tenant_id,
    project_id:project_id
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
    .findAndCountAll({ limit, offset, where: { tenant_id: tenantId }, include:[{model: db.project}] })
    .then(async (data) => {
      const res = await generalMethodService.getPagingData(data, page, limit);
      response = res;
    });
  return response;
};

exports.getFixVersionById = async (id, tenantId) => {
  return await fix_version.findOne({
    where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] },
  });
};
exports.getFixVersionByProject = async (project_id,tenantId) => {
  return await fix_version.findAll({
    where: { [Op.and]: [{ project_id: project_id },{ tenant_id: tenantId }] },
  });
};
exports.getFixVersionByName = async (fixversion, tenant_id) => {
  return await fix_version.findOne({
    where: { [Op.and]: [{ fix_version: fixversion }, { tenant_id: tenant_id }] }
  });
}