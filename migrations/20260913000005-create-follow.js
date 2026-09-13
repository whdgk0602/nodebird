module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Follow', {
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      followingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      followerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Follow');
  },
};
