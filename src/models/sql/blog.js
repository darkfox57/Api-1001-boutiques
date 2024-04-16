import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('blog', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  title: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  description: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  slug: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  content: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  tags: {
   type: DataTypes.JSON,
   allowNull: true
  }
 }, {
  timestamps: true
 })
}

