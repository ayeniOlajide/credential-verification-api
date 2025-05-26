import Joi from "joi";

export const login = async (data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().max(70).required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%&*?])[A-Za-z\\d!@#$%&*?]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password is invalid'
            }),
    }).options({ allowUnknown: false });
    return schema.validate(data);
}

export const register = async (data: any) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        phone: Joi.string().min(2).max(20).required(),
        email: Joi.string().email().max(30).required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%!&*?])[A-Za-z\\d@#$%!&*?]{8,}$'))
            .messages({
                'string.pattern.base': 'Passwords must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters. ',
            }),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match.',
        }),
    }).options({ allowUnknown: false })
    return schema.validate(data)
};

export const updateEmail = async (data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().max(150).required(),
    }).options({ allowUnknown: false });
    return schema.validate(data);
}

export const createUser = async (data: any) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().max(30).required(),
        phone: Joi.string().min(8).max(30).required(),
        role: Joi.string().required(),
        pattern: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%&*?])[A-Za-z\\d!@#$%&*?]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special characters.',
            })
    }).options({ allowUnknown: false });
    return schema.validate(data)
};

export const update = async (data: any) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(30),
        lastName: Joi.string().min(2).max(30),
        email: Joi.string().email().max(30),
        phone: Joi.string().min(8).max(30),
        role: Joi.string().required(),
    }).options({ allowUnknown: false })
    return schema.validate(data)
};

// export const updateName = async (data: any) => {
//     const schema =Joi.object({
//         firstName: Joi.string().min(2).max(30).required(),
//         lastName: Joi.string().min(2).max(30).required(),
//     }).options({ allowUnknown: false })
//     return schema.validate(data);
// };

export const twofa = async (data: any) => {
    const schema = Joi.object({
        otp: Joi.string().min(6).required(),
        userId: Joi.string().required(),
    }).options({ allowUnknown: true })
    return schema.validate(data);
};

export const otp = async (data: any) => {
    const schema = Joi.object({
        otp: Joi.string().min(6).required()
    }).options({ allowUnknown: true });
    return schema.validate(data)
};

export const changePassword = (data: any) => {
    const schema = Joi.object({
        newPassword: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%&*?])[A-Za-z\\d!@#$%&*?]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special characters.',
            })
    }).options({ allowUnknown: false })
    return schema.validate(data);
}

export const getOtp = async(data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().max(150).optional().allow(null, '').empty(''),
        userId: Joi.string().max(50).optional().allow(null, '').empty(''),
    })
    .or("email","userId")
    .options({ allowUnknown: false })
    return schema.validate(data);
}