# Validate.js

### Este plugin permite la validación de los casos más comunes contemplando multiples elementos:

input
: text
: checkbox
: radio
: password
: email

**select**
**textarea**

##Ejemplos de uso:

Objeto de opciones de usabilidad:
```
var opciones = {
		type: 'all',			// all (default), group, group-required
		group: '',				// nombre de la clase del grupo
		required: true,			// todos los requeridos (en conjunto con type)
		warn: true,				// default: true, Habilita el resaltado de campos incorrectos
		debug: false,			// default: false, Habilita los mensajes de errores por consola
		lang: 'translateJs',	// default: 'translateJs', object (json), var name (string)
		descriptions: true		// default: true, Habilita la descripción de los campos incorrectos (en conjunto con warn)
}
```
Definición de objetos de idiomas (si se no se usa **Translate.js**):
```
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
}
```
Inicialización en JavaScript:
```
Validate.itsOk(options);	// retorna true si todo está correcto
```

###Configuración de elementos **HTML**

Usando **options.type = 'all'**
```
<input type="text" required />
<input type="checkbox" name="testA" required /> <!-- Los checkboxes y los radio deben contener la directiva: name -->

...

<input type="radio" name="testB" required />
```

Usando **options.type = 'group'** y  **options.group = 'validame'**

```
<input type="text" class="validame" />
<textarea class="validame"></textarea>

...

<select class="validame">
	<option value="foo">foo</option>
	...
</select>
```
Usando **options.type = 'group-required'** y **options.group = 'validame'**
```
<input type="text" class="validame" required />
<textarea class="validame"></textarea>

...

<select class="validame" required>
	<option value="foo">foo</option>
	...
</select>

<!-- Solamete validará los campos que contengan la clase 'validame' y contengan la directiva required='true' o simplemente required -->
```

###Casos especiales:
Validando campo de email:
```
<input type="email" /> <!-- Los campos de email deben ser especificados como tal para una validación correcta -->
```
Personalizando validación (deben ser especificados a través de la directiva **data**):
```
<input type="email" data-min="2" /> <!-- Longitud mínima del campo de '2' caracteres -->
<input type="text" name="nombre" data-min="3" data-max="20" /> <!-- Longitud mínima del campo de '2' caracteres y máxima de 20 -->

```