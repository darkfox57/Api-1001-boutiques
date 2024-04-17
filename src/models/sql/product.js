import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('product', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
   type: DataTypes.TEXT,
   allowNull: false
  },
  description: {
   type: DataTypes.TEXT,
   allowNull: false
  },
  meta_title: {
   type: DataTypes.TEXT,
   allowNull: false
  },
  image1: {
   type: DataTypes.STRING,
   allowNull: false
  },
  link: {
   type: DataTypes.STRING,
   allowNull: false
  },
  short_description: {
   type: DataTypes.TEXT,
   allowNull: false
  },
  meta_description: {
   type: DataTypes.TEXT,
   allowNull: false
  },
  price: {
   type: DataTypes.FLOAT,
   allowNull: false
  }
 })
}
