import Joi from "joi";

export const create = async (data: any) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(300).required(),
        faculty: Joi.string().max(300).optional().allow(null, '').empty(''),
        department: Joi.string().max(300).optional().allow(null, '').empty(''),
        course: Joi.string().max(300).required(),
        degree: Joi.string().max(300).optional().allow(null, '').empty(''),
        page: Joi.number().optional().allow(null, '').empty(''),
        year: Joi.number().required(),
        institution: Joi.string().required(),
    }). options({ allowUnknown: false })
    return schema.validate(data);
}