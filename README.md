# Nextjs OpenJira App

Para correr localmente, se necesita la base de datos

`docker-compose up -d`

* El -d, significa __detached__
* MongoDB URL Local

`mongodb://localhost:27017/basededatos`
#
# Configurar las variabgles de entorno

* Renombrar el archivo __.env.template__ a __.env__

* contruir los módulos de node

```
yarn install
yarn dev
```

## Llenar la base de datos con información de prueba

Llamar
`http://localhost:3000/api/seed`
