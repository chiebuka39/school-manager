module.exports = function(sequelize, DataTypes) {
	return sequelize.define('student', {
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
		}
	});
};
