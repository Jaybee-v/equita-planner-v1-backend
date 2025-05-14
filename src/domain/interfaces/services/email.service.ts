export interface IEmailService {
  welcomeEmail(data: {
    name: string;
    email: string;
    url: string;
  }): Promise<void>;
  stableApprovalEmail(data: {
    stableName: string;
    name: string;
    email: string;
  }): Promise<void>;
  resetPasswordEmail(data: { email: string; url: string }): Promise<void>;
}
