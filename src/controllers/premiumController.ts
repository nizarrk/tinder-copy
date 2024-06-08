import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { db } from '../configs/sequelize';
import response from '../tools/response';
import moment from 'moment';

export const purchasePremium = async (req: Request, res: Response) => {
  const { package_id } = req.body;
  const userId = req.user.userId;

  try {
    // Find the premium package
    const premiumPackage = await db.tinderCopy.PremiumPackage.findByPk(package_id);

    if (!premiumPackage) {
      return response(req, res, { status: 404, message: 'Premium package not found' });
    }

    // Insert the purchase data into the user_premium_packages table
    const userPremium = await db.tinderCopy.UserPremiumPackage.create({
      user_id: userId,
      premium_package_id: premiumPackage.id,
      start_date: new Date(),
      end_date: moment().add(premiumPackage.duration_days, 'days').toDate(),
      created_at: new Date(),
      updated_at: new Date()
    });

    return response(req, res, { status: 200, message: 'Premium package purchased successfully', data: userPremium });
  } catch (error) {
    console.error(error);
    return response(req, res, { status: 500, message: 'Error purchasing premium package', data: error });
  }
};
