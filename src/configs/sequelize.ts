import { dir } from "console";
import fs from "fs";
import path from "path";
import * as Sequelize from "sequelize";

const { Op } = Sequelize;

const toCamelCaseName = (str: string): string => {
    return str.toLowerCase().replace(/_(.)/g, (_, match) => match.toUpperCase());
};

const directories: { [key: string]: string } = {
    [toCamelCaseName(process.env.MYSQL_TINDER_NAME || '')]: `../models/${toCamelCaseName(process.env.MYSQL_TINDER_NAME || '')}`
};

const sequelizeConfigurations: { [key: string]: Sequelize.Options } = {
    [toCamelCaseName(process.env.MYSQL_TINDER_NAME || '')]: {
        host: process.env.MYSQL_TINDER_HOST || 'localhost',
        dialect: 'mysql',
        database: process.env.MYSQL_TINDER_NAME || '',
        username: process.env.MYSQL_TINDER_USER || '',
        password: process.env.MYSQL_TINDER_PASS || '',
        pool: {
            min: Number(process.env.MYSQL_TINDER_POOL_MIN || '0'),
            max: Number(process.env.MYSQL_TINDER_POOL_MAX || '10'),
            idle: Number(process.env.MYSQL_TINDER_POOL_IDLE || '10000'),
            acquire: Number(process.env.MYSQL_TINDER_POOL_ACQUIRE || '30000'),
            evict: Number(process.env.MYSQL_TINDER_POOL_EVICT || '60000')
        },
        port: Number(process.env.MYSQL_TINDER_PORT || '3306'),
        logging: console.log,
        timezone: "+07:00"
    },
    // Add configurations for other databases as needed
};


const sequelizeInstances: { [key: string]: Sequelize.Sequelize } = {};

// Initialize sequelize instances
for (const [key, config] of Object.entries(sequelizeConfigurations)) {
    sequelizeInstances[key] = new Sequelize.Sequelize(config);
}


const authenticateSequelize = async (instanceName: string) => {
    try {
        await sequelizeInstances[instanceName].authenticate();
        console.log(`[OK] DB ${instanceName.toUpperCase()} connected!`);
    } catch (error) {
        console.error(
            `[ERR] DB ${instanceName.toUpperCase()} connection error!`,
            error
        );
    }
};

for (const instanceName in sequelizeInstances) {
    authenticateSequelize(instanceName);
}

const db: { [key: string]: any } = {};

const defineModels = (directory: string, sequelizeInstance: Sequelize.Sequelize) => {
    db[directory] = {};
    const files = fs.readdirSync(path.join(__dirname, directories[directory]))
        .filter((file) => file.indexOf(".") !== 0 && file.indexOf(".map") === -1);

    const importPromises = files.map(file => {
        return import(path.join(__dirname, directories[directory], file))
            .then(modelModule => {
                const model = modelModule.default(sequelizeInstance, Sequelize.DataTypes);
                db[directory][model.name] = model;
            })
            .catch(err => {
                console.error("Error importing model:", err);
            });
    });

    Promise.all(importPromises)
        .then(() => {
            Object.keys(db[directory]).forEach((name) => {
                if ("associate" in db[directory][name]) {
                    db[directory][name].associate(db[directory]);
                }
            });
        })
        .catch(err => {
            console.error("Error importing models:", err);
        });
};



for (const directory in directories) {
    defineModels(directory, sequelizeInstances[directory]);
}

export { db, sequelizeInstances, Op, Sequelize };
