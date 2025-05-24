module.exports = {
    watch: false,

    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

    moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|sequelize)/)',
  ],

  testEnvironment: 'jsdom'
};
