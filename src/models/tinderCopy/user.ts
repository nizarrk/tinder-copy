import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserAttributes {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    gender: string;
    birthdate: Date;
    location: string;
    bio: string;
    profile_picture: string;
    created_at: Date;
    updated_at: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public first_name!: string;
    public last_name!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public gender!: string;
    public birthdate!: Date;
    public location!: string;
    public bio!: string;
    public profile_picture!: string;
    public created_at!: Date;
    public updated_at!: Date;

    static associate(models: any) {
        User.hasMany(models.UserSwipe, {
            foreignKey: 'swiper_id',
            as: 'swipes',
        });

        User.hasMany(models.UserPremiumPackage, {
            foreignKey: 'user_id',
            as: 'user_premium_packages',
        });
    }
}

export default (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        profile_picture: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
    });

    return User;
};
