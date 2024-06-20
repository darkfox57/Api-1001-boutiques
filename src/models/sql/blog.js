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
  published: {
   type: DataTypes.BOOLEAN,
   allowNull: true,
   defaultValue: false
  },
  brandId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'brands', // Nombre de la tabla asociada al modelo Brand
    key: 'id',
   },
   allowNull: true,
  },
  collectionId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'collections', // Nombre de la tabla asociada al modelo Collection
    key: 'id',
   },
   allowNull: true,
  },
  typeId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'types', // Nombre de la tabla asociada al modelo Type
    key: 'id',
   },
   allowNull: true,
  },
  userId: {
   type: DataTypes.INTEGER,
   references: {
    model: 'users', // Nombre de la tabla asociada al modelo User
    key: 'id',
   },
   allowNull: false,
  }
 }, {
  timestamps: true
 });
}
