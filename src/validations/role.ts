import Joi from "joi";

export const create = async(data: any) => {
    const schema = Joi.object({
        roleName: Joi.string().min(1).max(200).required(),
        privileges: Joi.array().min(1).required(),
        roleAbbreviation: Joi.string().min(1).max(100),
    }).options({ allowUnknown: false })
    return schema.validate(data);
};