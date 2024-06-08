import { Sequelize, Model, DataTypes } from 'sequelize';

interface PremiumFeatureAttributes {
  id: number;
  name: string;
  premium_package_id: number;
  created_at: Date;
  updated_at: Date;
}

class PremiumFeature extends Model<PremiumFeatureAttributes> implements PremiumFeatureAttributes {
  public id!: number;
  public name!: string;
  public premium_package_id!: number;
  public created_at!: Date;
  public updated_at!: Date;

  // Define associations
  static associate(models: any) {
    PremiumFeature.belongsTo(models.PremiumPackage, {
      foreignKey: 'premium_package_id',
      as: 'premium_package'
    });
  }
}

export default (sequelize: Sequelize) => {
  PremiumFeature.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'PremiumFeature',
    tableName: 'premium_features',
  });

  return PremiumFeature;
};
