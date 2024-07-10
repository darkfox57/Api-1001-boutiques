import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('newsletter', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  email: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true,
  },
  optIn: {
   type: DataTypes.BOOLEAN,
   allowNull: false
  }
 }, {
  timestamps: false,
 });
};
