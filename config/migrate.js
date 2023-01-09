const sequelize = require('./database');

sequelize.sync({ alter: true }).then(() => {

    console.info(sequelize.models)
    console.info('Tables synchronisées !');

}).then(() => {

    sequelize.close();

}).catch(error => {

    console.error('Erreur lors de la synchronisation des tables :', error);

});