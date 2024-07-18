module.exports = (sequelize, DataTypes) => {
    const ExhibitorBrand = sequelize.define('ExhibitorBrand', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        media: DataTypes.JSON,
        contactPersonInfo:{
            type:DataTypes.JSON,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    return ExhibitorBrand;
};


// about: DataTypes.JSON,
// rsvp: DataTypes.JSON,
// description: DataTypes.STRING,

