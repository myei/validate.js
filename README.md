# Validate.js

Este plugin permite la validación de los casos más comunes contemplando múltiples elementos sin necesidad de tenerlos dentro de un ```<form>```:


## Ejemplos de uso:

Este plugin necesita [jQuery](https://jquery.com/download/) y se puege integrar el uso de traducciones con mi plugin [TranslateJs](https://github.com/myei/Translate)

```html
<script src="/path/to/jquery.min.js"></script>
<script src="/path/to/translate.min.js"></script> <!-- Opcional -->
<script src="/path/to/validate.min.js"></script>
```

#### Definición de opciones:

```javascript
var opciones = {
  type: 'all',      // group, group-required (def. all)
  group: '',      // Nombre de la clase del grupo
  required: true,   // Sólo campos requeridos (def. true)
  warn: true,     // Resaltado de campos incorrectos (def. true)
  debug: false,     // Mensajes de errores por consola (def. false)
  lang: 'default',    // JSON ó nombre de la variable
  descriptions: true  // Descripción de los campos incorrectos (def. true)
}
```

#### Personalización de mensajes:

Si queremos cambiar los mensajes por defecto debemos hacerlo siguiendo la siguiente estructura:

> Sí se usa **[Translate.js](https://github.com/myei/Translate)** se debe incluir este objeto en cada idioma


```javascript
var validateJs = {
  min: 'La longitud de caracters mínima para este campo es de: ',
  max: 'La longitud de caracters máxima para este campo es de: ',
  numbers: 'Este campo solo permite números',
  letters: 'Este campo solo permite letras (sin espacios)',
  lettersSpaces: 'Este campo solo permite letras',
  email: 'Esto no es una dirección email valida, por favor verifícala',
  text: 'Este campo es requerido y no puede estar vacío',
  password: 'Este campo es requerido y no puede estar vacío',
  'select-one': 'Este campo es requerido y no puede estar vacío',
  textarea: 'Este campo es requerido y no puede estar vacío',
  hidden: 'Este campo es requerido y no puede estar vacío',
  checkbox: 'Este campo es requerido y no puede estar vacío',
  radio: 'Este campo es requerido y no puede estar vacío',
  ip: 'Esto no es una dirección ip valida, por favor verifícala'
}
```

#### Ejecutando validación:

```javascript
Validate.itsOk(options);  // retorna true si todo está correcto
```

#### Configuración de elementos **HTML**

Usando ```options.type = 'all'```

```html
<input type="text" required />
```


Usando ```options.type = 'group'``` y  ```options.group = 'validame'```

```html
<input type="radio" name="genero" class="validame" />
<input type="radio" name="genero" class="validame" />
```

> Usando ```options.type = 'group-required'``` y ```options.group = 'nombre-de-clase'``` sólo valida los campos del grupo que sean **required**



#### Casos especiales:

El campo de ```email``` debe ser especificado con su tipo:

```html
<input type="email" class="validame" />
```

> Los campos ```checkbox``` y ```radio``` deben contener la propiedad ```name```


La validación por defecto de todos los campos especificados es **vacío**, para personalizar esto se pueden usar los ```modificadores``` a través de la directiva ```data```:

```html
<input type="text" name="nombres" data-min="3" data-letters-spaces="true" />

...
<textarea data-min="2" data-max="140" />
```

> Los ```modificadores``` pueden ser usados en conjunto y los disponibles son: 
> - ```min```: longitud mínima del campo
> - ```max```: longitud máxima del campo
> - ```letters```: sólo permite letras
> - ```letters-spaces```: permite letras y espacios
> - ```numbers```: sólo permite números
> - ```ip```: permite direcciones válidas


###· Live validations


También se pueden agregar validaciones de **pulsaciones de teclas**, para que solo se permitan ciertas teclas ```role```, a una serie de elementos que contengan una  determinada clase ```target```:

> Los ```role``` disponibles son:
> - ```alphabetic```: solo permite letras
> - ```numeric```: solo permite números
> - ```international_phone```: valida los teléfonos según el formato NBXXXXXXXX


```javascript
Validate.addLive(role, target);
```

> Sí ```target``` no se especifica, el valor por defecto es validate-```role```
> ej: validate-alphabetic