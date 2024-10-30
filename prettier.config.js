import config from '@macklinu/prettier-config'

/** @type {import('prettier').Config & import('prettier-plugin-sql').SqlFormatOptions & import('prettier-plugin-embed').PrettierPluginEmbedOptions} */
export default {
  ...config,
  plugins: ['prettier-plugin-embed', 'prettier-plugin-sql'],
  embeddedSqlTags: ['sql', 'this.sql'],
  language: 'postgresql',
  keywordCase: 'upper',
}
