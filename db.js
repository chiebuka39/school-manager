const Sequelize = require('sequelize');
var sequelize;

sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-sch-api.sqlite'
});

var db = {};

db.admin = sequelize.import(__dirname + '/models/admin.js');
db.class = sequelize.import(__dirname + '/models/class.js');
db.student = sequelize.import(__dirname + '/models/student.js');
db.teacher = sequelize.import(__dirname + '/models/teacher.js');
db.token = sequelize.import(__dirname + '/models/token.js');


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.student.belongsTo(db.class);
db.teacher.belongsTo(db.class);

db.class.hasMany(db.student);
db.class.hasOne(db.teacher);

module.exports = db;
