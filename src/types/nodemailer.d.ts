declare module 'nodemailer' {
  namespace nodemailer {
    export type SentMessageInfo = unknown;

    export type SendMailOptions = {
      from?: string;
      to: string;
      subject: string;
      text?: string;
      html?: string;
      [key: string]: unknown;
    };

    export interface Transporter {
      sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
    }

    export function createTransport(options: unknown): Transporter;
  }

  const nodemailer: typeof nodemailer;
  export = nodemailer;
}
