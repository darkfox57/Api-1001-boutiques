import { DataTypes, UUIDV4 } from 'sequelize';

export default (sequelize) => {
 sequelize.define('blog', {
  id: {
   type: DataTypes.UUID,
   defaultValue: UUIDV4,
   primaryKey: true,
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
   type: DataTypes.TEXT('long'),
   allowNull: false,
  },
  tags: {
   type: DataTypes.ARRAY(DataTypes.STRING),
   allowNull: false
  }
 }, {
  timestamps: true
 })
}
