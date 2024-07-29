
import { verifyToken } from '~/services/TokenService';
const VerifyApiKey = async (req,res, next) => {
	const apiKey = req.header('x-api-key');

	const verified = await verifyToken(apiKey);

	res.locals['api-key-verified'] = verified;
	res.locals['api-key'] = apiKey;

	await next();
}

export default VerifyApiKey;
