import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Compiler, Configuration, RuleSetUse, WebpackPluginInstance } from 'webpack';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const tsRuleUse: RuleSetUse = [{ loader: 'ts-loader', options: { transpileOnly: true } }];

const plugins: (
  | ((this: Compiler, compiler: Compiler) => void)
  | WebpackPluginInstance
)[] = [
  new ForkTsCheckerWebpackPlugin(),
  new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
];

if (isDevelopment) {
  // fast refresh
  tsRuleUse.unshift({
    loader: 'babel-loader',
    options: { plugins: ['react-refresh/babel'] },
  });
  plugins.unshift(new ReactRefreshPlugin());
}

const config: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: './src/index.tsx',
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
        use: tsRuleUse,
      },
    ],
  },
  plugins,
};

export default config;
