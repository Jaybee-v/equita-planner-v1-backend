import { registerAs } from '@nestjs/config';

export default registerAs('googleOAtuh', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl: process.env.GOOGLE_REDIRECT_URL,
}));
