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
  media: {
      type: DataTypes.JSON,
      allowNull: true,
  },
  expiryDate: {
type: DataTypes.DATE,
allowNull: true,
},
  views: {
   type: DataTypes.INTEGER,
   allowNull: true,
  },
  likes: {
   type: DataTypes.INTEGER,
   allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  shares: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: { facebook: 0, twitter: 0, linkedin: 0, whatsApp: 0, link: 0 },
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
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
