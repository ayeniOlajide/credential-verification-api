import Joi from "joi";


export const create = async (data: any) => {
    const schema = Joi.object({
        institutionName: Joi.string().min(2).max(250).required(),
        institutionAddress: Joi.string().min(2).max(250).required(),
        city: Joi.string().max(200).optional().allow(null, '').empty(''),
        country: Joi.string().max(200).optional().allow(null, '').empty(''),
        state: Joi.string().max(200).optional().allow(null, '').empty(''),
        phone: Joi.string().min(8).max(15).optional().allow(null, '').empty(''),
        siteUrl: Joi.string().optional().allow(null, '').empty(''),
        email: Joi.string().email().max(150).optional().allow(null, '').empty(''),
        role: Joi.string().optional().allow(null, '').empty(''),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.'
            }).optional().allow(null, '').empty(''),
    }).options({ allowUnknown: false })
    return schema.validate(data);
};

export const update = async (data: any) => {
    const schema = Joi.object({
        institutionName: Joi.string().min(2).max(250).required(),
        institutionAddress: Joi.string().min(2).max(250).required(),
        city: Joi.string().max(200).optional().allow(null, '').empty(''),
        state: Joi.string().max(200).optional().allow(null, '').empty(''),
        phone: Joi.string().min(8).max(15).optional().allow(null, '').empty(''),
        siteUrl: Joi.string().optional().allow(null, '').empty(''),
        email: Joi.string().email().max(150).optional().allow(null, '').empty(''),
        adminGroup: Joi.string().optional().allow(null, '').empty(''),
    }).options({ allowUnknown: false });
    return schema.validate(data);
};