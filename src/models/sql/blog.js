import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('blog', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  title: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  description: {
   type: DataTypes.STRING,
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
   type: DataTypes.STRING,
   allowNull: false
  }
 }, {
  timestamps: true
 })
}

