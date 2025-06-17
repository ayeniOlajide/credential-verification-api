import Joi from "joi";

export const login = async (data: any) => {
    const schema = Joi.object({
        username:Joi.string().optional(),
        email: Joi.string().email().max(70).optional(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%&*?])[A-Za-z\\d!@#$%&*?]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password is invalid'
            })
    })
    .or('email', 'username')
    .options({ allowUnknown: false });
    return schema.validate(data);
}

export const register = async (data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().max(30).required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%!&*?])[A-Za-z\\d@#$%!&*?]{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Passwords must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters. ',
            }),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match.',
        }),
    }).options({ allowUnknown: false })
    return schema.validate(data)
};


export const completeProfile = async (data: any) => {
    const schema = Joi.object({
        accountType: Joi.string().valid("candidate", "recruiter").required(),
        username: Joi.string().min(2).max(30).required(),
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        phone: Joi.string().min(2).max(20).required(),
        qualifications: Joi.array().items(Joi.string()),
        organizationName: Joi.string().optional(),
        dateOfBirth: Joi.date().less('now').required().messages({
            'date.less': 'Date of birth must be in the past.'
        }),
        gender: Joi.string().valid("male", "female", "other").optional()
    }).options({ allowUnknown: false })
    return schema.validate(data);
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
        username: Joi.string().min(2).max(30).required(),
        qualifications: Joi.array().items(Joi.string()),
        organizationName: Joi.string().optional(),
        location: Joi.string().optional(),
        gender: Joi.string().valid("male", "female", "other").optional(),
        accountType: Joi.string().optional(),
        password: Joi.string()
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
        phone: Joi.string().min(8).max(30),
        accountType: Joi.string().valid("candidate", "recruiter"),
        qualifications: Joi.array().items(Joi.string()),
        dateOfBirth: Joi.date().less('now').messages({
            'date.less': 'Date of birth must be in the past.',
        }),
        organizationName: Joi.string().optional(),
        gender: Joi.string().valid("male", "female", "other").optional()
    }).options({ allowUnknown: false })
    return schema.validate(data)
};


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
        oldPassword: Joi.string().required(),
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

export const registerRecruiter = async(data: any) => {
    const schema = Joi.object({
        organizationName: Joi.string().required(),
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        phone: Joi.string().min(8).max(20).required(),
        email: Joi.string().email().max(70).required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%!&*?])[A-Za-z\\d@#$%!&*?]{8,}$'))
            .messages({
                'string.pattern.base': 'Passwords must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters. ',
            }),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match.',
        }),
    }).options({  allowUnknown: false });
    return schema.validate(data);
}