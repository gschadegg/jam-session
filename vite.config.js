import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return defineConfig({
    resolve: { alias: { '@': '/src' } },
    plugins: [react()],
    server: {
      host: true,
      port: 8000,
      proxy: {
        '/api': {
          target: `http://${process.env.LOCAL_API_URL}:5000`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  })
}
