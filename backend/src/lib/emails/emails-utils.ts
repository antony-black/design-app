import fg from 'fast-glob';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import { sendEmailThroughBrevo } from '../brevo';
import { env } from '../env';
import { logger } from '../logger';

const getHbrTemplates = _.memoize(async () => {
  const distDir = path.resolve(__dirname, '../emails/dist');
  const htmlPathsPattern = path.join(distDir, '*.html').replace(/\\/g, '/');

  const htmlPaths = fg.sync(htmlPathsPattern);
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {};

  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html');
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8');
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate);
  }

  return hbrTemplates;
});

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates();
  const hbrTemplate = hbrTemplates[templateName];
  const html = hbrTemplate(templateVariables);

  return html;
};

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string;
  subject: string;
  templateName: string;
  templateVariables?: Record<string, any>;
}) => {
  try {
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: env.CLIENT_URL,
    };

    const html = await getEmailHtml(templateName, fullTemplateVaraibles);
    const { loggableResponse } = await sendEmailThroughBrevo({ to, html, subject });

    logger.info('email', 'sendEmail', {
      to,
      templateName,
      templateVariables,
      response: loggableResponse,
    });
    return { ok: true };
  } catch (error) {
    logger.error('email', error, {
      to,
      templateName,
      templateVariables,
    });
    return { ok: false };
  }
};
