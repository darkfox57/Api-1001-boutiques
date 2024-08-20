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
  brand: {
   type: DataTypes.STRING,
   allowNull: false
  },
  collection: {
   type: DataTypes.STRING,
   allowNull: false
  },
  type: {
   type: DataTypes.STRING,
   allowNull: false
  },
  category: {
   type: DataTypes.STRING,
   allowNull: false
  },
  description: {
   type: DataTypes.STRING,
   allowNull: false
  },
  image1: {
   type: DataTypes.STRING,
   allowNull: false
  },
  link: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true,
  },
  pricepercentreduction: {
   type: DataTypes.STRING,
   allowNull: false
  },
  price: {
   type: DataTypes.FLOAT,
   allowNull: false
  },
  old_price: {
   type: DataTypes.FLOAT,
   allowNull: false
  },
  type_form: {
   type: DataTypes.STRING,
   allowNull: false
  }
 })
}
