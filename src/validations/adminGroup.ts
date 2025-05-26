import Joi from "joi";

export const create = async (data: any) => {
    const schema = Joi.object({
        adminGroupName: Joi.string().min(2).max(200).required(),
        adminGroupAddress: Joi.string().min(2).max(200).required(),
        email: Joi.string().email().max(150).required(),
        city: Joi.string().max(150).required(),
        state: Joi.string().max(150).required(),
        phone: Joi.string().min(8).max(15).required(),
        role: Joi.string().required(),
        password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.',
            })
    }).options({ allowUnknown: false });
    return schema.validate(data)
}

export const update = async (data: any) => {
    const schema = Joi.object({
        adminGroupName: Joi.string().min(2).max(200).required(),
        adminGroupAddress: Joi.string().min(2).max(200).required(),
        email: Joi.string().email().max(150).required(),
        city: Joi.string().max(150).required(),
        state: Joi.string().max(150).required(),
        phone: Joi.string().min(8).max(15).required(),
    }).options({ allowUnknown: false })
    return schema.validate(data)
};