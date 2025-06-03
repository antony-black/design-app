import { type sendEmail } from './emails-utils';

jest.mock('./emails-utils', () => {
  const original = jest.requireActual('./emails-utils');
  const mockedSendEmail: typeof sendEmail = jest.fn(async () => {
    return {
      ok: true,
    };
  });

  return {
    ...original,
    sendEmail: mockedSendEmail,
  };
});
