FROM node:20-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
WORKDIR /app

# Copiar package.json y modificarlo para eliminar dependencias específicas de Windows
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Eliminar dependencias específicas de Windows antes de instalar
RUN node -e "const pkg=require('./package.json'); delete pkg.dependencies.msnodesqlv8; delete pkg.dependencies['sequelize-msnodesqlv8']; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

# Instalar las dependencias con --no-optional para evitar dependencias específicas de plataforma
RUN \
  if [ -f package-lock.json ]; then npm ci --no-optional --ignore-scripts; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configuración para el cliente Prisma mock en caso de error de conexión
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configurar los permisos adecuados para el directorio de caché de Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar el resultado de la compilación de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
