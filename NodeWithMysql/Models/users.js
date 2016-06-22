var Sequelize = require('sequelize');

exports.getSchema = function() {
  return {
    user_id: { type: Sequelize.CHAR(36), primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    user_name: { type: Sequelize.STRING, defaultValue: null },
    email_id: { type: Sequelize.STRING, unique: true },
    phone_no: { type: Sequelize.BIGINT(11), defaultValue: 9999999999},
    alt_phone_no: { type: Sequelize.BIGINT(11), defaultValue: 9999999999 },
    customer_pin: { type: Sequelize.CHAR(8), defaultValue: null },
    password: { type: Sequelize.STRING}
  };
};

exports.getTableName = function(){
  return "tbl_user_details";
};