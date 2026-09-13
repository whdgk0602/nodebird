module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PostHashtag', {
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      HashtagId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'hashtags',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      PostId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
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
    await queryInterface.dropTable('PostHashtag');
  },
};
