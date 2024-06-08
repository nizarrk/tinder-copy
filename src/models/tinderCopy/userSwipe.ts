import { DataTypes, Model, Sequelize } from 'sequelize';

interface SwipeAttributes {
  id: number;
  swiper_id: number;
  swiped_user_id: number;
  action: string;
  created_at: Date;
}

class UserSwipe extends Model<SwipeAttributes> implements SwipeAttributes {
    public id!: number;
    public swiper_id!: number;
    public swiped_user_id!: number;
    public action!: string;
    public created_at!: Date;

    static associate(models: any) {
        UserSwipe.belongsTo(models.User, {
            foreignKey: 'swiper_id',
            as: 'swiper',
        });
        UserSwipe.belongsTo(models.User, {
            foreignKey: 'swiped_user_id',
            as: 'swiped_user',
        });
    }
}

export default (sequelize: Sequelize) => {
    UserSwipe.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        swiper_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        swiped_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'UserSwipe',
        tableName: 'user_swipes',
        timestamps: false,
    });

    return UserSwipe;
};
