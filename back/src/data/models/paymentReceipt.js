const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'PaymentReceipt',
        {
            paymentDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            amount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },
            period: {
                type: DataTypes.STRING, // Por ejemplo: "Marzo 2024"
                allowNull: false,
            },
            installmentNumber: {
                type: DataTypes.INTEGER, // Número de la cuota actual
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            totalInstallments: {
                type: DataTypes.INTEGER, // Total de cuotas del contrato
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
        },
        {
            paranoid: true,
        }
    );
};
