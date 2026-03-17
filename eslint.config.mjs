import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  formatters: false,

  ignores: ['dist', 'extension', 'node_modules', '*.d.ts'],

  rules: {
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'style/operator-linebreak': 'off',
    'no-console': 'warn',
  },
})
