// import Joi from 'joi';

// export const create = async (data: any) => {
//   const schema = Joi.object({
//     platformQueryCommission: Joi.number().required(),
//     platformDownloadCommission: Joi.number().required(),
//     institutionQueryCommission: Joi.number().required(),
//     institutionDownloadCommission: Joi.number().required(),
//     organizationQueryCommission: Joi.number().required(),
//     organizationDownloadCommission: Joi.number().required(),
//   }).options({ allowUnknown: false });
//   return schema.validate(data);
// };