<<<<<<< HEAD
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
=======
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
>>>>>>> 14aee8150c5bf87a278071cb51b69b8b2bef1fad
