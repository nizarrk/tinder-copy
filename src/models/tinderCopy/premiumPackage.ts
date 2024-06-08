import { Sequelize, Model, DataTypes } from 'sequelize';

interface PremiumPackageAttributes {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  created_at: Date;
  updated_at: Date;
}

class PremiumPackage extends Model<PremiumPackageAttributes> implements PremiumPackageAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
  public duration_days!: number;
  public created_at!: Date;
  public updated_at!: Date;

  static associate(models: any) {
    PremiumPackage.hasMany(models.PremiumFeature, {
          foreignKey: 'premium_package_id',
          as: 'premium_features',
      });
  }  
}

export default (sequelize: Sequelize) => {
  PremiumPackage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration_days: {
      type: DataTypes.INTEGER,
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
    modelName: 'PremiumPackage',
    tableName: 'premium_packages',
  });

  return PremiumPackage;
};
