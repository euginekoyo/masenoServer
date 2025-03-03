// config/database.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('quickConnect', 'root', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
