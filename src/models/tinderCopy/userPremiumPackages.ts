import { Sequelize, Model, DataTypes } from 'sequelize';

interface UserPremiumPackageAttributes {
  id: number;
  user_id: number;
  premium_package_id: number;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

class UserPremiumPackage extends Model<UserPremiumPackageAttributes> implements UserPremiumPackageAttributes {
  public id!: number;
  public user_id!: number;
  public premium_package_id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // Define associations
  static associate(models: any) {
    UserPremiumPackage.belongsTo(models.PremiumPackage, {
      foreignKey: 'premium_package_id',
      as: 'premium_package'
    });

    UserPremiumPackage.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

export default (sequelize: Sequelize) => {
  UserPremiumPackage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    premium_package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'premium_packages',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'UserPremiumPackage',
    tableName: 'user_premium_packages',
  });

  return UserPremiumPackage;
};
