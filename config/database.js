const Sequelize = require('sequelize');

const sequelize = new Sequelize({

    dialect: 'sqlite',
    storage: 'data.sqlite',
    logging: false
    
});

sequelize.authenticate().then(() => {

    console.log('Connexion à la base de données réussie !');

}).catch(err => {  

    console.error('Erreur lors de la connexion à la base de données :', err);

});

module.exports = sequelize;