module.exports = {
    watch: false,

    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

 moduleNameMapper: {
  '\\.module\\.css$': 'identity-obj-proxy',
  '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
},


  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|sequelize)/)',
  ],

  testEnvironment: 'jsdom'
};
