module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove CSS minimizer completely
      if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          (minimizer) => minimizer.constructor.name !== 'CssMinimizerPlugin'
        );
      }

      return webpackConfig;
    },
  },
};
