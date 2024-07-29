
import { verifyToken } from '~/services/TokenService';
const VerifyToken = async (req,res, next) => {
	const cookies = req.cookies;

	const admin = await verifyToken(cookies['x-token']);

	res.locals.admin = admin;


	await next();
}

export default VerifyToken;
