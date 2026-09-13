module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      PostId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('comments');
  },
};
