import { userService } from '../services';
import { errorGenerator } from '../utils';
import { asyncWrapper } from '../utils';
import { CheckFormatColumn } from '../utils/formatCheckUser';

const successResMessage = (num, res, message, data) => {
  res.status(num).json({
    message,
    data,
  });
};

const getAlluser = asyncWrapper(async (req, res) => {
  const user = await userService.getAllUser();
  if (!user) errorGenerator(409, 'USERNAME_DOSES_NOT_EXIST');
  successResMessage(201, res, 'USERNAME_EXIST', user);
});

const checkUserName = asyncWrapper(async (req, res) => {
  const { username } = req.body;
  username || errorGenerator(400, 'USERNAME_DOSES_NOT_EXIST');
  CheckFormatColumn(username, 'username') ||
    errorGenerator(400, `IS_NOT_USERNAME_FORMAT`);
  await userService.checkUsername(username);
  successResMessage(201, res, 'AVAILABLE_ID', username);
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  successResMessage(201, res, 'SUCCESS_DELETE_USER');
});

const createUser = asyncWrapper(async (req, res) => {
  await userService.checkUsername(req.body.username);
  const requiredKeys = [
    'realName',
    'username',
    'password',
    'email',
    'phoneNumber',
    'isAgreedServicePolicy',
    'isAgreedCollectPrivate',
    'isAgreedPhoneMarketing',
    'isAgreedEmailMarketing',
  ];
  requiredKeys.forEach((key, index) => {
    const CHECK_PATTERN_RANGE = 5;
    const keyUpper = key.toLocaleUpperCase();
    if (!(key in req.body)) {
      errorGenerator(400, keyUpper + '_DOSES_NOT_EXIST');
    }
    if (index < CHECK_PATTERN_RANGE) {
      CheckFormatColumn(req.body[key], key) ||
        errorGenerator(400, `IS_NOT_${keyUpper}_FORMAT`);
    }
  });
  const { token, signupUser } = await userService.createUser({ ...req.body });
  res.cookie('user', token);
  successResMessage(201, res, 'SIGN_UP_SUCCESS', signupUser);
});

const signInUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.signInUser(email, password);

  res.cookie('user', user.token);
  res.status(201).json({ message: user.message });
});

export default {
  getAlluser,
  checkUserName,
  createUser,
  signInUser,
  deleteUser,
};
