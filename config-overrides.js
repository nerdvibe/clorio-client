const { override } = require("customize-cra");
const cspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

const cspConfigPolicy = {
  "default-src":
    "'self' https://*.clor.io https://fonts.googleapis.com https://api.mina.tools",
  "connect-src":
    "'self' https://*.clor.io/v1/graphql https://api.mina.tools/v1/epoch",
  "img-src": "https://*.staketab.com 'self'",
  "script-src": "'self'",
  "style-src": "'self' https://fonts.googleapis.com",
  "object-src": "'self'",
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
