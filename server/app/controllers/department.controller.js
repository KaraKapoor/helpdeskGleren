const db = require("../models");
const Department = db.department;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tickets } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tickets, totalPages, currentPage };
};

exports.findAll = (req, res) => {
  Department.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};

exports.create = (req, res) => {
  // Validate request
  if (!req.body.departmentName) {
    res.status(400).send({
      message: "Department Name is mandatory",
    });
    return;
  }

  const department = {
    departmentName: req.body.departmentName,
  };

  Department.create(department)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating.",
      });
    });
};

exports.findAllWithPagination = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const orderBy = req.query.orderBy;
  const orderDirection = req.query.orderDirection;
  let sortColumns;
  if (orderBy !== undefined && orderBy !== "undefined") {
    if (orderBy === 'departmentName') {
      sortColumns = ['departmentName', orderDirection];
    }else {
      sortColumns = [orderBy, orderDirection];
    }

  } else {
    sortColumns = ['createdAt', 'DESC'];
  }

  Department.findAndCountAll({
    limit, offset,order: [sortColumns],
  })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tickets."
      });
    });
}