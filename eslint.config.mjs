import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/lib/zk.ts']),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['src/components/ui/LiquidEther.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/unsupported-syntax': 'off',
    },
  },
]);

export default eslintConfig;
