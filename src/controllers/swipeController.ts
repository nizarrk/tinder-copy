import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import { db } from '../configs/sequelize';
import response from '../tools/response';
import moment from 'moment';
import user from '../models/tinderCopy/user';

export const getListUserSwipe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId;
        const today = moment().toDate();

        let swipeLimit = 10; // Default swipe limit

        // Check if the user has a premium package that removes the swipe limit
        const premiumPackage = await db.tinderCopy.UserPremiumPackage.findOne({
            where: {
                user_id: userId,
                start_date: {
                    [Op.lte]: today // Premium package should be active
                },
                end_date: {
                    [Op.gte]: today // Premium package should not have expired
                }
            },
            include: [
                {
                    model: db.tinderCopy.PremiumPackage,
                    as: 'premium_package',
                    include: [
                        {
                            model: db.tinderCopy.PremiumFeature,
                            as: 'premium_features'
                        }
                    ]
                }
            ]
        });

        // Count the number of swipes the user has made today
        let swipeCount = await db.tinderCopy.UserSwipe.count({
            where: {
                swiper_id: userId,
                created_at: {
                    [Op.gte]: moment().startOf('day').toDate(), // Start of the day
                },
            },
        });        

        // Allow premium users to bypass swipe limits
        if (premiumPackage) {
            const checkFeature = premiumPackage.premium_package.premium_features.find((item: any) => item.name === "Unlimited Swipes");
            console.log('check feature', checkFeature);
            
            if (checkFeature) {                
                swipeCount = Infinity;
            }
        }
        
        // If the user has already reached the swipe limit, return an appropriate response
        if (swipeCount >= 10 && swipeCount != Infinity) {
            return response(req, res, { status: 400, message: 'You have reached the daily limit of 10 swipes.' });
        }

        // Query to find other users that the current user hasn't swiped on today
        const otherUsers = await db.tinderCopy.User.findAll({
            where: {
                id: {
                    [Op.and]: [
                        { [Op.ne]: userId },
                        {
                            [Op.notIn]: Sequelize.literal(`
                                (SELECT swiped_user_id FROM user_swipes
                                WHERE swiper_id = ${userId} AND created_at >= '${today.toISOString()}')
                            `)
                        }
                    ]
                }
            },
            include: [
              {
                model: db.tinderCopy.UserPremiumPackage,
                as: 'user_premium_packages',
                include: [
                    {
                        model: db.tinderCopy.PremiumPackage,
                        as: 'premium_package',
                        include: [
                            {
                                model: db.tinderCopy.PremiumFeature,
                                as: 'premium_features'
                            }
                        ]
                    }
                ]
              }  
            ],
            attributes: { exclude: ['password'] }, // Exclude the password field
            order: Sequelize.literal('RAND()'), // Randomize the order of results
            limit: swipeCount === Infinity ? swipeLimit : swipeLimit - swipeCount, // Limit the number of results to the remaining swipes allowed
        });
        
        // Process each user to add the is_verified flag
        const processedUsers = otherUsers.map((user: any) => {
            const isVerified = user.user_premium_packages.some((userPremiumPackage: any) => 
                userPremiumPackage.premium_package.premium_features.some((feature: any) => 
                    feature.name === 'Verified Label'
                )
            );
            return {
                ...user.toJSON(),
                is_verified: isVerified
            };
        });

        return response(req, res, { status: 200, data: processedUsers });
    } catch (error) {
        console.error(error);
        return response(req, res, { status: 500, message: 'Error fetching other users', error });
    }
};

export const userSwipe = async (req: Request, res: Response) => {
    const { swiped_user_id, action } = req.body;
    const swiper_id = req.user.userId;

    try {
        const today = moment().toDate();

        // Check if the user has a premium package that removes the swipe limit
        const premiumPackage = await db.tinderCopy.UserPremiumPackage.findOne({
            where: {
                user_id: swiper_id,
                start_date: {
                    [Op.lte]: today // Premium package should be active
                },
                end_date: {
                    [Op.gte]: today // Premium package should not have expired
                }
            },
            include: [
                {
                    model: db.tinderCopy.PremiumPackage,
                    as: 'premium_package',
                    include: [
                        {
                            model: db.tinderCopy.PremiumFeature,
                            as: 'premium_features'
                        }
                    ]
                }
            ]
        });

        // Count the number of swipes the user has made today
        let swipeCount = await db.tinderCopy.UserSwipe.count({
            where: {
                swiper_id,
                created_at: {
                    [Op.gte]: moment().startOf('day').toDate(), // Start of the day
                },
            },
        });        

        // Allow premium users to bypass swipe limits
        if (premiumPackage) {
            const checkFeature = premiumPackage.premium_package.premium_features.find((item: any) => item.name === "Unlimited Swipes");
            console.log('check feature', checkFeature);
            
            if (checkFeature) {                
                swipeCount = Infinity;
            }
        }
        
        // If the user has already reached the swipe limit, return an appropriate response
        if (swipeCount >= 10 && swipeCount != Infinity) {
            return response(req, res, { status: 400, message: 'You have reached the daily limit of 10 swipes.' });
        }

        // Record the new swipe
        const newSwipe = await db.tinderCopy.UserSwipe.create({
            swiper_id,
            swiped_user_id,
            action,
            created_at: new Date()
        });

        return response(req, res, { status: 200, message: 'Swipe recorded successfully', data: newSwipe });
    } catch (error) {
        console.error(error);
        return response(req, res, { status: 500, message: 'Error recording swipe', error });
    }
};
