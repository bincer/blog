module.exports = {
  title: 'Bincer',
  tagline: 'A single step makes a thousand miles.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'bincer', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Bincer',
      logo: {
        alt: 'Bincer Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: '知识库',
          position: 'left',
        },
        {to: 'blog', label: '博客', position: 'left'},
        {
          href: 'https://github.com/bincer/blog',
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
              label: 'Style Guide',
              to: 'docs/',
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/bincer/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl: 'https://github.com/bincer/docusaurus/edit/master/website/',
        },
        blog: {
          // showReadingTime: true,
          // Please change this to your repo.
          // editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
