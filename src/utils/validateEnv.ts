import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
	cleanEnv(process.env, {
		// MONGO_URL: str(),
		// JWT_SECRET: str(),
		// JWT_LIFETIME: str(),
		// CLOUD_NAME: str(),
		// CLOUD_APIKEY: str(),
		// CLOUD_SECRET: str(),
		PORT: port(),
	});
};

export default validateEnv;
