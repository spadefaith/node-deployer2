import Models from '~/server/db';
import bcryptjs from 'bcryptjs';
import * as TokenService from '~/services/TokenService';
export const login = async (obj: { username: string; password: string }) => {
	const { username, password } = obj;

	const find = await Models.Accounts.findOne({
		raw: true,
		where: {
			username: username
		}
	});

	if (!find) {
		throw new Error('user not found');
	}

	const compare = await bcryptjs.compare(password, find.password);

	if (!compare) {
		throw new Error('password is incorrect');
	}

	const token = TokenService.createLoginToken({ username: find.username, role_id: find.role_id });

	return token;
};

export const verify = async (obj: { token: string }) => {
	const verify = TokenService.verifyToken(obj.token);

	return verify;
};
