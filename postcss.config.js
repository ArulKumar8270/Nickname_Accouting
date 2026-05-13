export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@reduxjs/toolkit'],
    exclude: [],
  },
  resolve: {
    alias: {
      // Prevents dual package issue
    }
  }
})