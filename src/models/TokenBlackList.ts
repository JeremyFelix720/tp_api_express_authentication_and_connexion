// Quand un utilisateur se déconnecte, les Tokens générés restent actifs pour l'API jusqu'à la fin de leur durée de vie programmée (1h, 1j, etc.). Il faut donc les rajouter dans une "liste noire" quand l'utilisateur se deconnecte pour interdire l'API de les utiliser (et de ne plus pouvoir acceder aux fonctionnalités pour lesquelles il faut d'abord s'authentifier).

import { DataTypes, Sequelize } from "sequelize";

export const TokenBlackListModel = (sequelize: Sequelize) => {
    return sequelize.define('token-black-list', {
        token: DataTypes.STRING,
    });
}