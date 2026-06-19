// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vibe Coding OS',
  tagline: 'AI Coding Skill Framework',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://roronoazoroshao369.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, this is usually "/<projectName>/"
  baseUrl: '/vibe-coding-os/',

  // GitHub pages deployment config
  organizationName: 'roronoazoroshao369',
  projectName: 'vibe-coding-os',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/roronoazoroshao369/vibe-coding-os/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Vibe Coding OS',
        logo: {
          alt: 'Vibe Coding OS Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/roronoazoroshao369/vibe-coding-os',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Quickstart',
                to: '/docs/quickstart',
              },
              {
                label: 'Install',
                to: '/docs/install',
              },
              {
                label: 'First Workflow',
                to: '/docs/first-workflow',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/roronoazoroshao369/vibe-coding-os',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} roronoazoroshao369. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
