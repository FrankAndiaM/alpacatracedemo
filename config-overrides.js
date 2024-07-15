const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias['~'] = path.join(__dirname, 'src');
  config.resolve.alias['~hooks'] = path.join(__dirname, 'src/hooks');
  config.resolve.alias['~models'] = path.join(__dirname, 'src/models');
  config.resolve.alias['~redux-store'] = path.join(__dirname, 'src/redux-store');
  config.resolve.alias['~routes'] = path.join(__dirname, 'src/routes');
  config.resolve.alias['~services'] = path.join(__dirname, 'src/services');
  config.resolve.alias['~ui'] = path.join(__dirname, 'src/ui');
  config.resolve.alias['~assets'] = path.join(__dirname, 'src/ui/assets');
  config.resolve.alias['~atoms'] = path.join(__dirname, 'src/ui/atoms');
  config.resolve.alias['~molecules'] = path.join(__dirname, 'src/ui/molecules');
  config.resolve.alias['~organisms'] = path.join(__dirname, 'src/ui/organisms');
  config.resolve.alias['~pages'] = path.join(__dirname, 'src/ui/pages');
  config.resolve.alias['~templates'] = path.join(__dirname, 'src/ui/templates');
  config.resolve.alias['~utils'] = path.join(__dirname, 'src/utils');
  config.resolve.alias['~config'] = path.join(__dirname, 'src/config');
  config.resolve.alias['~theme'] = path.join(__dirname, 'src/ui/themes');

  config.plugins = config.plugins || [];
  return config;
};
