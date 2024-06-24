import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('brand', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  slug: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true,
  },
  meta_title: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  meta_desc: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  meta_keywords: {
   type: DataTypes.STRING,
   allowNull: true,
  },
 }, {
  timestamps: false,
 });
};
