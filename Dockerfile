# Menggunakan image Node.js versi LTS
FROM node:18-alpine

# Mengatur direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi di dalam container
RUN npm install

# Menyalin seluruh kode aplikasi
COPY . .

# Mengekspos port aplikasi
EXPOSE 3001

# Menjalankan aplikasi
CMD ["npm", "start"]
