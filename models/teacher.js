module.exports = function(sequelize, DataTypes) {
	return sequelize.define('teacher', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
    level: {
      type: DataTypes.ENUM('lv1', 'lv2', 'lv3', 'lv4', 'lv5'),
      allowNull: false,
      defaultValue:'lv1'
    }
	});
};
