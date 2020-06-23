# Validate.js

Este es un plugin **ligero**, **easy-to-use**, que permite la validación **personalizable y con pocas configuraciones** de los casos más comunes contemplando múltiples elementos **en tiempo real** y sin necesidad de tenerlos dentro de un ```<form>```:


## Ejemplos de uso:

Puedes probar el [demo](https://myei.github.io/validate.js/) con algunas de las funcionalidades listadas.

Este plugin necesita [jQuery](https://jquery.com/download/) y se puege integrar el uso de traducciones con mi plugin [TranslateJs](https://github.com/myei/translate.js)

```html
<script src="/path/to/jquery.min.js"></script>
<script src="/path/to/translate.min.js"></script> <!-- Opcional -->
<script src="/path/to/validate.min.js"></script>
```

## Ejecutar validaciones:

```javascript
validate = Validate(opciones) // Sí ```realTime: true```, ya comienza a escuchar en cada campo

// Para verificar el estatus de la validación global es de la siguiente forma:
validate.itsOk();  // (ret. boolean)
```

## Definición de opciones:

Los siguientes son los valores por defecto, se pueden especificar sólo los valores que deseemos cambiar

```javascript
var opciones = {
  type: 'all',          // all ó group
  group: '',            // Nombre de la clase del grupo (requiere type: 'group')
  required: true,       // Sólo campos requeridos
  warn: true,           // Resaltado de campos incorrectos
  descriptions: true,   // Descripción de los campos incorrectos (requiere warn: true)
  lang: 'default',      // JSON personalizado, 'translateJs' ó 'default' (requiere warn: true y descriptions: true)
  animations: true,     // Animar los campos incorrectos (requiere warn: true)
  color: 'red',         // (hex) color de los errores, (inlcuir #, requiere warn: true)
  realTime: true,       // Validar al pulsar una tecla (requiere warn: true)
  debug: false          // Mensajes de errores por consola
}
```

## Personalización de mensajes:

A continuación se muestran los mensajes por defecto. Si queremos cambiarlos, podemos pasar la siguiente variable en el atributo ```lang``` del objeto [```opciones```](#definición-de-opciones), únicamente con los mensajes que queremos personalizar:

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
  'select-one': 'Debe seleccionar alguna opción de la lista',
  'select-multiple': 'Debe seleccionar al menos una opción de la lista',
  textarea: 'Este campo es requerido y no puede estar vacío',
  hidden: 'Este campo es requerido y no puede estar vacío',
  checkbox: 'Este campo es requerido y no puede estar vacío',
  radio: 'Este campo es requerido y no puede estar vacío',
  ip: 'Esto no es una dirección ip valida, por favor verifícala',
  url: 'Esto no es una url correcta. <br> - ej: https://google.com',
  pattern: 'Esto no cumple con el patrón especificado: '
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

Otra forma de personalizar los mensajes es por medio de la directiva ```data-regla-msg``` (Las reglas disponibles las puedes consultar [aquí](#reglas-de-validación)):

```html
<!-- Personalizando una sola regla -->
<input type="text" data-pattern="^[0-9]+$" data-pattern-msg="Mensaje personalizado, sólo para este campo, y para la regla específicada">

<!-- Personalizando varias reglas -->
<input type="text" data-max="10" data-min="2" data-min-msg="Mensaje para regla min" data-max-msg="Mensaje para regla max" required>

<!-- Mostrado sólo en caso de no usar otras reglas -->
<input type="text" data-default-msg="Mensaje personalizado, sólo para este campo">
```

## Configuración de elementos **HTML**

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


## Reglas de validación

La validación por defecto de todos los campos especificados es **vacío**, para personalizar esto se pueden añadir ```reglas``` a través de la directiva ```data``` --> (```data-regla```):

```html
<input type="text" name="nombres" data-min="3" data-letters-spaces />

<textarea data-min="2" data-max="140" data-numbers />
```

> Las ```reglas``` pueden ser usadas en conjunto y las disponibles son:
> - ```min```: (int) longitud mínima del campo
> - ```max```: (int) longitud máxima del campo
> - ```letters```: sólo permite letras
> - ```letters-spaces```: permite letras y espacios
> - ```numbers```: sólo permite números
> - ```ip```: ip ej: 127.0.0.1
> - ```passwd```: al menos una letra mayúscula, al menos una letra minúscula, al menos un carácter numérico, al menos un carácter especial (!@#._-$%^&*)
> - ```email```: dirección de correo
> - ```url```: url ej: https://google.com
> - ```pattern```: Permite proveer una expresión regular personalizada, ej: ^[0-9]+$
> - ```optional```: Será ignorado mientras este vacío


## Live validations


También se pueden agregar validaciones de **pulsaciones de teclas**, para que sólo se permitan ciertas teclas ```role```, a una serie de elementos que contengan una  determinada clase ```target```:

> Los ```role``` disponibles son:
> - ```alphabetic```: solo permite letras
> - ```numeric```: solo permite números


```javascript
Validate().addLive(role, target);

Validate().addLive('numeric', 'validame'); // Ej: <input type="text" class="validame">
```

> Sí ```target``` no se especifica, el valor por defecto es validate-```role```
> ej: validate-alphabetic

```javascript
Validate().addLive('alphabetic'); // Ej: <input type="text" class="validate-alphabetic">
```
