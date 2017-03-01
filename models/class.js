module.exports = function(sequelize, DataTypes) {
	return sequelize.define('class', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}
	});
};
