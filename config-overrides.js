const { override } = require("customize-cra");
const cspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

const cspConfigPolicy = {
  "default-src": "'self' https://*.clor.io https://fonts.googleapis.com",
  "connect-src": "'self' https://*.clor.io/v1/graphql",
  "img-src": "https://*.staketab.com 'self'",
  "script-src": "'self'",
  "style-src": "'self' https://fonts.googleapis.com",
  "font-src": "https://fonts.googleapis.com https://fonts.gstatic.com",
};

function addCspHtmlWebpackPlugin(config) {
  if (process.env.NODE_ENV === "production") {
    config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy));
  }

  return config;
}

module.exports = {
  webpack: override(addCspHtmlWebpackPlugin),
};
