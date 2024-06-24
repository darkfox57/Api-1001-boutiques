import { DataTypes, Sequelize } from "sequelize";

export default (sequelize) => {
 sequelize.define('Category', {
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
   type: DataTypes.STRING(255),
   allowNull: false,
   unique: true
  },
  meta_title: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  meta_desc: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  meta_keywords: {
   type: DataTypes.STRING,
   allowNull: false,
  },
 }, {
  tableName: 'Category',
  timestamps: false
 });
}

