const environmentSpecificVariables = {
  development: {
    url: 'http://localhost:8080',
  },
  production: {
    url: 'https://www.fluid-type-scale.com',
  },
};

module.exports = {
  title: 'Fluid Type Scale Calculator',
  author: 'Aleksandr Hovhannisyan',
  email: 'aleksandrhovhannisyan@gmail.com',
  description: 'Generate font size variables for a fluid type scale.',
  keywords: ['fluid type scale', 'modular scale', 'type scale'],
  language: 'en-US',
  favicon: {
    widths: [32, 57, 76, 96, 128, 192, 228],
    format: 'png',
  },
  ...environmentSpecificVariables[process.env.ELEVENTY_ENV],
};
