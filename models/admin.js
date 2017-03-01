const bcrypt = require('bcryptjs');
const _ = require('underscore');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken')

module.exports = function(sequelize, DataTypes){
    var admin =  sequelize.define('admin', {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        salt: {
          type: DataTypes.STRING
        },
        password_hash: {
          type: DataTypes.STRING
        },
        password: {
          type: DataTypes.VIRTUAL,
          allowNull: false,
          validate: {
            len: [7,100]
          },
          set: function(value) {
              var salt = bcrypt.genSaltSync(10);
              var hashedPassword = bcrypt.hashSync(value, salt);

              this.setDataValue('password', value);
              this.setDataValue('salt', salt);
              this.setDataValue('password_hash', hashedPassword);
          }
        }
    }, {
      hooks: {
        beforeValidate: function(admin, options){
          //admin.email
          if(typeof admin.emai === 'string') {
              admin.email = admin.email.toLowerCase();
          }
      }
    }, classMethods: {
        authenticate: function(body) {
            return new Promise(function(resolve, reject) {

                resolve();
                /*if(typeof body.email !== 'string' || body.password !== 'string') {
                    console.log(e);
                    return reject();
                }

                admin.findOne({
                    where: {
                      email : body.email
                    }
                }).then(function(admin){
                    /*if(!admin || !bcrypt.compareSync(body.password, admin.get('password_hash'))) {
                        console.log(e);
                        return reject();
                    }

                    resolve(admin);
                }, function(e) {
                    console.log(e);
                    reject();
                });*/
            });
        },
        findByToken: function(token) {
            return new Promise(function(resolve, reject) {
                try {
                  var decodedJWT = jwt.verify(token,'qwerty098');
                  var bytes = cryptojs.AES.decrypt(decodedJWT, 'abcd123');
                  var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

                  admin.findById(tokenData.id).then(function (admin) {
                      if(admin) {
                          resolve(admin);
                      } else {
                          reject();
                      }
                  }, function(e) {
                    reject();
                  });
                } catch (e) {
                    reject();
                }
              });
            }

          },
          instanceMethods: {
            toPublicJSON: function() {
              var json = this.toJSON();
              return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
            },
            generateToken: function(type) {
              if(!_.isString(type)){
                return undefined;
              }

              try {
                var stringData = JSON.stringify({
                  id: this.get('id'),
                  type: type
                });
                var encryptedData = cryptojs.AES.encrypt(stringData, 'abcd123').toString();
                var token = jwt.sign({
                  token: encryptedData
                }, 'qwerty098');

                return token;
              } catch (e) {
                  console.log(e);
                  return undefined;
              }
            }
          }
      });

      return admin;
  };
