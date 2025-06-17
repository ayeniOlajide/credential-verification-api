import Joi from "joi";


export const create = async (data: any) => {
    const schema = Joi.object({
        institutionName: Joi.string().min(2).max(250).required(),
        type: Joi.string().valid("university", "polytechnic", "training-centre").optional(),
        country: Joi.string().max(200).optional().allow(null, '').empty(''),
        state: Joi.string().max(200).optional().allow(null, '').empty(''),
    }).options({ allowUnknown: false })
    return schema.validate(data);
};

export const update = async (data: any) => {
    const schema = Joi.object({
        institutionName: Joi.string().min(2).max(250).required(),
        type: Joi.string().valid("university", "polytechnic", "training-centre").optional(),
        country: Joi.string().max(200).optional().allow(null, '').empty(''),
        state: Joi.string().max(200).optional().allow(null, '').empty(''),
    }).options({ allowUnknown: false });
    return schema.validate(data);
};