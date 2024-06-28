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
  published: {
   type: DataTypes.BOOLEAN,
   allowNull: true,
   defaultValue: false
  },
  views: {
   type: DataTypes.INTEGER,
   allowNull: true,
  },
  likes: {
   type: DataTypes.INTEGER,
   allowNull: true,
  },
  brandId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'brands',
    key: 'id',
   },
   allowNull: true,
  },
  collectionId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'collections',
    key: 'id',
   },
   allowNull: true,
  },
  typeId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'types',
    key: 'id',
   },
   allowNull: true,
  },
  userId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'users',
    key: 'id',
   },
   allowNull: false,
  }
 }, {
  timestamps: true
 });
}
