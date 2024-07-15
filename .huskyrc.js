module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'prettier --write src/**/*.{ts,tsx} && eslint ./src --ext .ts,.tsx'
  }
};
