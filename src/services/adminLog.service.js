import AdminLog from "../models/adminLog.model.js";

export const logAdminAction = async (adminId, action, resource) => {
  return AdminLog.create({ adminId, action, resource });
};