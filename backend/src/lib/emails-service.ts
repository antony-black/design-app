import { addNewIdeaRoute } from '@design-app/client/src/lib/routes';
import { type Idea, type User } from '@prisma/client';
import fg from 'fast-glob';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import _ from 'lodash';
import path from 'path';
import { sendEmailThroughBrevo } from './brevo';
import { env } from './env';

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
//   const distDir = path.resolve(__dirname, '../emails/dist');
//   const htmlPathsPattern = path.join(distDir, '*.html').replace(/\\/g, '/');

//   // Debug: check folder existence
//   const folderExists = existsSync(distDir);
//   console.log('>>>> Checking folder:', distDir);
//   console.log('>>>> Folder exists:', folderExists);

//   if (folderExists) {
//     const files = readdirSync(distDir);
//     console.log('>>>> Files in folder:', files);
//   } else {
//     console.warn('>>>> Email templates directory does not exist!');
//   }

//   // Debug: log the glob pattern
//   console.log('>>>> Glob pattern:', htmlPathsPattern);

//   // Use cwd to avoid platform path quirks
//   const htmlFiles = fg.sync('*.html', { cwd: distDir });
//   const htmlPaths = htmlFiles.map((file) => path.join(distDir, file));

//   console.log('>>>> Matched HTML paths:', htmlPaths);

//   // Compile templates
//   const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {};
//   for (const htmlPath of htmlPaths) {
//     const templateName = path.basename(htmlPath, '.html');
//     const htmlTemplate = await fs.readFile(htmlPath, 'utf8');
//     hbrTemplates[templateName] = Handlebars.compile(htmlTemplate);
//   }

//   return hbrTemplates;
// });

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates();
  const hbrTemplate = hbrTemplates[templateName];
  const html = hbrTemplate(templateVariables);

  return html;
};

const sendEmail = async ({
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

    console.info('sendEmail', {
      to,
      templateName,
      templateVariables,
      response: loggableResponse,
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
};

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registration!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${addNewIdeaRoute({ abs: true })}`,
    },
  });
};

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your Idea Blocked!',
    templateName: 'ideaBlocked',
    templateVariables: {
      ideaNick: idea.nick,
    },
  });
};
