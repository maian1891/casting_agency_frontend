import { EnvironmentPlugin } from 'webpack';
import { config } from 'dotenv';

config();

module.exports = {
  plugins: [
    new EnvironmentPlugin([
      'API_SERVER_URL',
      'AUDIENCE',
      'AUTH_URL',
      'CALLBACK_URL',
      'CLIENT_ID',
      'NODE_OPTIONS',
    ]),
  ],
};
