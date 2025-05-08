import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../data/database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  fullname: {
    type: DataTypes.STRING, allowNull: false
  },
  email: {
    type: DataTypes.STRING,  allowNull: false, unique: true
  },
  password: {
    type: DataTypes.STRING, allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  name:        { type: DataTypes.STRING, allowNull: false },
  tag:         { type: DataTypes.STRING, allowNull: false },
  cost:        { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT,   allowNull: false },
  contact:     { type: DataTypes.STRING, allowNull: false },
  delivery:    { type: DataTypes.STRING, allowNull: false },
  image:       { type: DataTypes.TEXT,   allowNull: false },
  owner:       { type: DataTypes.STRING, allowNull: false },
  listed:      { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'tasks',
  timestamps: false
});

const Storage = sequelize.define('Storage', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  duration: {type: DataTypes.STRING, allowNull: false},
  cost: {type: DataTypes.FLOAT, allowNull: true},
  size: {type: DataTypes.FLOAT, allowNull: false},
  contact: {type: DataTypes.STRING, allowNull: true},
  description: {type: DataTypes.STRING, allowNull: true},
  image: {type: DataTypes.TEXT, allowNull: false},
  owner: {type: DataTypes.STRING, allowNull: false},
  listed: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
  tableName: 'storage',
  timestamps: true,
})

export { sequelize, User, Task, Storage };
