import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('search_keywords', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  keyword: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true,
  },
  brand: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  collection: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  type: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
 });
}


