import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('session', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  userId: {
   type: DataTypes.INTEGER,
   allowNull: false
  },
  expiresAt: {
   type: DataTypes.DATE,
   allowNull: false
  }
 }, {
  timestamps: false
 });
}
