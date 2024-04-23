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
   type: DataTypes.STRING(255),
   allowNull: false,
   unique: true
  },
  img: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  content: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  tags: {
   type: DataTypes.JSON,
   allowNull: true
  },
  category: {
   type: DataTypes.STRING,
   allowNull: true
  },
  published: {
   type: DataTypes.BOOLEAN,
   allowNull: true,
   defaultValue: false
  }
 }, {
  timestamps: true
 })
}

