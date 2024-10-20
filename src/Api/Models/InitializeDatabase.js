const { sequelize } = require("../../Config/Database/db.config");
const { User, UserLog, Role, Permission, RolePermissions } = require("./Association");

module.exports = {
  InitializeDatabase: async () => {
    try {
      sequelize.MAIN_DB_NAME.sync();
      console.log('Database & tables created!');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  },
};


