# Validate.js

Este plugin permite la validación de los casos más comunes contemplando múltiples elementos sin necesidad de tenerlos dentro de un ```<form>```:


## Ejemplos de uso:

Puedes probar el [demo](https://myei.github.io/validate.js/) con algunas de las funcionalidades listadas.

Este plugin necesita [jQuery](https://jquery.com/download/) y se puege integrar el uso de traducciones con mi plugin [TranslateJs](https://github.com/myei/translate.js)

```html
<script src="/path/to/jquery.min.js"></script>
<script src="/path/to/translate.min.js"></script> <!-- Opcional -->
<script src="/path/to/validate.min.js"></script>
```

#### Definición de opciones:

Los siguientes son los valores por defecto, se pueden especificar sólo los valores que deseemos cambiar

```javascript
var opciones = {
  type: 'all',        // all ó group
  group: '',          // Nombre de la clase del grupo (requiere group: 'algun-nombre')
  required: false,     // Sólo campos requeridos
  warn: true,         // Resaltado de campos incorrectos
  descriptions: true, // Descripción de los campos incorrectos (requiere warn: true)
  lang: 'default',    // JSON personalizado, 'translateJs' ó 'default' (requiere warn: true)
  animations: true,   // Animar los campos incorrectos (requiere warn: true)
  color: 'red',       // (hex) color de los errores, (inlcuir #)
  realTime: true,     // Validar al pulsar una tecla (requiere warn: true)
  debug: false        // Mensajes de errores por consola
}
```

#### Personalización de mensajes:

Si queremos cambiar los mensajes por defecto, podemos pasar la siguiente variable en el atributo ```lang``` del objeto ```opciones```, cambiando sólo lo que deseemos personalizar:

> Sí se usa **[Translate.js](https://github.com/myei/translate.js)** se debe incluir este objeto en cada idioma


```javascript
var validateJs = {
  min: 'La longitud de caracters mínima para este campo es de: ',
  max: 'La longitud de caracters máxima para este campo es de: ',
  numbers: 'Este campo solo permite números',
  letters: 'Este campo solo permite letras (sin espacios)',
  lettersSpaces: 'Este campo solo permite letras',
  text: 'Este campo es requerido y no puede estar vacío',
  password: 'Este campo es requerido y no puede estar vacío',
  passwd: 'Al menos una letra mayúscula <br> - Al menos una letra minúscula <br> - Al menos un carácter numérico <br> - Al menos un carácter especial (!@#._-$%^&*)',
  email: 'Debe ser un email válido',
  'select-one': 'Este campo es requerido y no puede estar vacío',
  textarea: 'Este campo es requerido y no puede estar vacío',
  hidden: 'Este campo es requerido y no puede estar vacío',
  checkbox: 'Este campo es requerido y no puede estar vacío',
  radio: 'Este campo es requerido y no puede estar vacío',
  ip: 'Esto no es una dirección ip valida, por favor verifícala'
}

opciones = {
  lang: validateJs
};

// ó

opciones = {
  lang: {
    min: 'Mensaje personalizado para min'
  }
};
```

Otra forma de personalizar los mensajes es por medio de la directiva ```data-default-msg``` (mostrado sólo en caso de estar vacío):

```html
<input type="text" data-default-msg="Mensaje personalizado, sólo para este campo">
```

#### Ejecutando validación:

```javascript
validate = Validate(opciones) // Sí ```realTime: true``, ya comienza a escuchar en cada campo

// Para verificar el estatus de la validación global es de la siguiente forma:
validate.itsOk();  // (ret. boolean)
```

#### Configuración de elementos **HTML**

Usando ```opciones.type = 'all'``` cubrirá todos los elementos: ```input```, ```select```, ```textarea``` sin distinción

```html
<input type="text" />
```

Usando ```opciones.type = 'all'``` y ```opciones.required = true```

```html
<input type="text" required/>
```

Usando ```opciones.type = 'group'``` y  ```opciones.group = 'validame'```

```html
<input type="radio" name="genero" class="validame" />

<select name="genero" class="validame">
  <option value=""></option>
</select>
```

> Usando ```opciones.required = true``` sólo validará los campos del ```target``` que sean **required**


> Los campos ```checkbox``` y ```radio``` deben contener la propiedad ```name```


La validación por defecto de todos los campos especificados es **vacío**, para personalizar esto se pueden usar los ```modificadores``` a través de la directiva ```data```:

```html
<input type="text" name="nombres" data-min="3" data-letters-spaces="true" />

...
<textarea data-min="2" data-max="140" />
```

> Los ```modificadores``` pueden ser usados en conjunto y los disponibles son:
> - ```min```: (int) longitud mínima del campo
> - ```max```: (int) longitud máxima del campo
> - ```letters```: (bool) sólo permite letras
> - ```letters-spaces```: (bool) permite letras y espacios
> - ```numbers```: (bool) sólo permite números
> - ```ip```: (bool) permite direcciones válidas
> - ```passwd```: (bool) al menos una letra mayúscula, al menos una letra minúscula, al menos un carácter numérico, al menos un carácter especial (!@#._-$%^&*)
> - ```email```: (bool) dirección de correo


### Live validations


También se pueden agregar validaciones de **pulsaciones de teclas**, para que solo se permitan ciertas teclas ```role```, a una serie de elementos que contengan una  determinada clase ```target```:

> Los ```role``` disponibles son:
> - ```alphabetic```: solo permite letras
> - ```numeric```: solo permite números


```javascript
Validate.addLive(role, target);
```

> Sí ```target``` no se especifica, el valor por defecto es validate-```role```
> ej: validate-alphabetic
