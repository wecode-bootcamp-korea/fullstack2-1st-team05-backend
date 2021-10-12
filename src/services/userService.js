import { userDAO } from '../models';
import { errorGenerator } from '../utils';
import { bcrypt } from '../utils';

const getAlluser = async () => {
  return await userDAO.getAlluser();
};

const checkUserName = async username => {
  const isRealNameCheck = await userDAO.checkUserName(username);
  if (isRealNameCheck) errorGenerator(409);
};

const deleteUser = async id => {
  const isDeleteUser = await userDAO.deleteUser(id);
  if (isRealNameCheck) errorGenerator(409);
};

const createUser = async userInfo => {
  const { password } = userInfo;
  const hashPassword = await bcrypt.encryptPw(password);
  userInfo.password = hashPassword;
  return userDAO.createUser(userInfo);
};

export default { getAlluser, checkUserName, createUser };
