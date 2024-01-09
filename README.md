# PATRÓN CRITERIA

### ¿Qué es y para qué nos sirve?

Este patrón de diseño nos permite ahorrar mucho código a la hora de realizar busquedas en una base de datos. Facilita la obtención de uno o más registros de forma totalmente dinámica con pocas líneas de código.

Ejemplo:

Supongamos que tenemos un schema en mongo con las siguientes propiedades:

```js

export class User {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true })
  auth0Id: string;

  @Prop({ default: '' })
  profilePic: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Pet' }], default: [] })
  pets: Pet[];
}

```

**NOTA: Este es solo un ejemplo ilustrativo, ya que muchas de estas propiedades podrían no ser las más adecuadas para establecer como parámetro de búsqueda de un único registro.**

En nuestro servicio posiblemente querramos desarrollar la lógica para buscar un registro en la base de datos a través de alguno de sus campos.

Si necesitamos buscarlo por \_id crearemos el método getUserById() y posiblemente en el futuro necesitemos buscar un usuario por otro campo lo cual llevará a tener un código como este:

```js

getUserById(id:string){
  //lógica
 }

getUserByAuth0Id(auth0Id:string){
  //lógica
 }

getUserByMail(mail:string){
  //lógica
 }

```

Esto lleva a tener servicios demasiado extensos y dificil de escalar con el tiempo, sin olvidar que el schema user puede crecer con nuevos campos, lo cuál aumentará el número de métodos de búsqueda en el servicio.

Existe una solución muy práctica que nos ahorra decenas o cientos de líneas de código repetidas. Usar el patrón criteria para desarrollar un solo método que permita buscar de forma dinámica a un usuario en la base de datos.

Para realizarlo, necesitamos crear primeramente una interface:

## _user.criteria.ts_

En esta interface vamos a colocar como opcional cada uno de los campos por los cuales podríamos llegar a buscar a un usuario en la base de datos.

```js
export interface userCriteria {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  auth0Id?: string;
}
```

## findUserByCriteria()

Ahora que tenemos la interface creamos el método criteria, este método recibe por parámetro un objeto tipado con dicha interface.

```js

async findUserByCriteria(criteria: userCriteria) {
  if (Object.keys(criteria).length === 0)
    throw new InternalServerErrorException('Invalid criteria');

  return await this.userModel
    .findOne(criteria)
    .lean()
    .exec();
}

```

Para que este método funcione es importante recibir un objeto con al menos UNA propiedad que sirva para buscar el registro en la base de datos, en este caso, lanzamos una excepción si se pasa un objeto vacío por parámetro.

Veamos algunos ejemplos de implementación:

Buscando por email:

```js
const user = await this.userService.findUserByCriteria({
  email: 'franco@gmail.com',
});
```

Buscando por auth0Id:

```js
const reqAuth0Id = '12312319319fda';
const user = await this.userService.findUserByCriteria({
  auth0Id: reqAuth0Id,
});
```

Buscando por más de un campo:

```js
const user = await this.userService.findUserByCriteria({
  firstName: 'franco',
  lastName: 'rodriguez',
});
```

Como se puede apreciar, de una forma muy sencilla se puede reutilizar este método para buscar por cualquier campo que sea necesario y se puede escalar facilmente.
Imaginemos que en un futuro el usuario tiene un nuevo campo llamado "DNI", tan solo modificando la interface podemos buscar usuarios a través de este campo:

```js
export interface userCriteria {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  auth0Id?: string;
  dni?:string // <== nuevo campo de búsqueda
}
```

Ahora podemos buscarlo por dni:

```js
const user = await this.userService.findUserByCriteria({
  dni: '11222333',
});
```

## populate()

Imaginemos que nuestro schema tiene varias propiedades relacionadas con otros schemas y en determinados casos, nos gustaría hacer un populate de esas propiedades. Incluso con este método, podemos realizar búsquedas populadas de una forma muy sencilla si realizamos unos pequeños ajustes.

Existen 2 formas diferentes de encarar el populate en este método:

- Pasar un boolean por parámetro para activar el populate.
- Activar dinámicamente las propiedades que queremos con populate.

### Usando un boolean

```js

  async findUserByCriteria(criteria: userCriteria, populate: boolean = false) {
    if (Object.keys(criteria).length === 0)
      throw new InternalServerErrorException('Invalid criteria');

    return await this.userModel
      .findOne(criteria)
      .populate(populate ? ['pets', 'address'] : '')
      .lean()
      .exec();
  }

```

Usando esta estrategía, sumamos un nuevo parámetro que es opcional ya que por defecto se inicializa en false. Este parámetro "activa" el populate, por defecto el criteria no nos va a devolver el registro populado a menos que explicitamente mandemos un "true".

```js
//El usuario sin el populate
const userWithoutPopulate = await this.userService.findUserByCriteria({
  email: 'franco@gmail.com',
});

//El usuario con el populate
const userPopulated = await this.userService.findUserByCriteria(
  {
    email: 'franco@gmail.com',
  },
  true,
);
```

Esta forma de hacer populate en el criteria es simple y práctica, pero tiene sus desventajas, ya que tenemos que predefinir dentro del método de búsqueda las propiedades que serán populadas y esto nos condiciona a retornar un objeto populado con todas sus propiedades, esto puede ser útil a veces, pero en ciertos casos será innecesario y estamos obligados a un "todo o nada".

```js

 .populate(populate ? ['pets', 'address'] : '') //queda predefinido en el método un "todo o nada".

```

### Activar dinámicamente las propiedades que queremos con populate.

```js

  async findUserByCriteria(criteria: userCriteria,
  populate: PopulateOptions | (PopulateOptions | string)[] = null,) {
    if (Object.keys(criteria).length === 0)
      throw new InternalServerErrorException('Invalid criteria');

    return await this.userModel
      .findOne(criteria)
      .populate(populate)
      .lean()
      .exec();
  }

```

Esta forma nos otorga más libertad, pasamos como segundo parámetro las propiedades que queremos que sean populadas, si no pasamos nada, el método retornará un registro plano.

```js
//Usuario sin populate:
const userWithoutPopulate = await this.userService.findUserByCriteria({
  email: 'franco@gmail.com',
});

//Usuario con una propiedad populada:
const userWithPets = await this.userService.findUserByCriteria(
  {
    email: 'franco@gmail.com',
  },
  ['pets'],
);

//Usuario con más de una propiedad populada:
const userWithPopulate = await this.userService.findUserByCriteria(
  {
    email: 'franco@gmail.com',
  },
  ['pets', 'address'],
);
```

A través de esta implementación podemos popular de forma dinámica según sea el caso y no estamos obligados a un "todo o nada" que en muchos casos puede llevar a registros extensas que no necesitamos.

## Consideraciones finales

- El patrón criteria nos permite ahorrarnos mucho código a hora de buscar registros en la base de datos, ya que centramos todas las búsquedas por diferentes parámetros dentro de un mismo método dinámico.

- Tenemos que valorar en que casos es verdaderamente beneficiosos aplicarlo, ya que en schemas con pocas propiedades o en los cuales no vamos a realizar búsquedas mas que por id, no tiene sentido implementarlo.

- Este método es muy versatil y no solo sirve para traer un registro, sino que también se puede implementar para traer un array de registros que coincidan con determinados parámetros de búsqueda.

Veamos un pequeño ejemplo del potencial:

```js
  @Get('/search')
  searchUsers(
    @Query('city') city: string,
    @Query('gender') gender: string,
    @Query('status') status: string,
    @Query('verified') verified:boolean,
  ) {

    let criteria = {};
    if (city) criteria = { ...criteria, city };
    if (gender) criteria = { ...criteria, gender };
    if (status) criteria = { ...criteria, status };
    if (verified) criteria = { ...criteria, verified };

    return this.userService.listUsersByCriteria(criteria);
  }

```

Este patrón es muy personalizable y se puede ajustar a nuestras necesidades, por lo que es interesante valorar en que situaciones le podemos sacar provecho.
