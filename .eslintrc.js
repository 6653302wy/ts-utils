module.exports = {
    extends: ['@shm-open/eslint-config-bundle'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 启用不强制函数的返回定义
        'no-underscore-dangle': 'off', // 启用局部变量使用下划线
        'no-plusplus': 'off', // 启用++写法
        'no-bitwise': 'off', // 启用位运算
        'import/no-unused-modules': 'off',
        'no-throw-literal': 0,
        '@typescript-eslint/no-explicit-any': ['off'],
        'default-param-last': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['off'],
        'no-console': 'off',
    },
};
