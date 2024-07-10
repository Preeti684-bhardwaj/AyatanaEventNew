// module.exports = (sequelize, DataTypes) => {
//     const Executive = sequelize.define('Executive', {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         phone: DataTypes.STRING,
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         IsActivated: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false
//         },
//         IsEmailVerified: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false
//         },
//         IsPhoneVerified: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false
//         },
//         emailToken: DataTypes.STRING,
//         createdAt: DataTypes.DATE,
//         updatedAt: DataTypes.DATE
//     });

//     return Executive;
// };

