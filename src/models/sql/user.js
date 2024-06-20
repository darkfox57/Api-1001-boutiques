import { DataTypes } from 'sequelize';

export default (sequelize) => {
 sequelize.define('user', {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  email: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true,
  },
  name: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  password: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  bio: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  role: {
   type: DataTypes.ENUM('admin', 'editor', 'writter'),
   allowNull: false,
   defaultValue: 'writter',
  }
 }, {
  timestamps: true
 });
}
