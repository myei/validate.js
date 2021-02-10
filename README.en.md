# Validate.js

This is a **lightweight**, **easy-to-use** plugin, which allows **customizable** and **highly configurable** validations of the most common cases contemplating multiple elements in **real time**, without having them within a ```<form>```.

Quieres ver esto en [Español](https://github.com/myei/validate.js/blob/master/README.md)?

## Examples, demo and requirements:

You can try the [demo](https://myei.github.io/validate.js/) with some of the features listed.

This plugin requires [jQuery](https://jquery.com/download/) and if you want translations, can be integrated easily with my plugin [TranslateJs](https://github.com/myei/translate.js)

```html
<script src="/path/to/jquery.min.js"></script>
<script src="/path/to/translate.min.js"></script> <!-- Optional -->
<script src="/path/to/validate.min.js"></script>
```

## Usage:

```javascript
validate = Validate(options) // If ```realTime: true```, starts listening in every compatible fields now.

// In order to check the validation status, it's like this:
validate.itsOk();  // (ret. boolean)
```

## Options definitions:

These are the default values, and you can pass only the ones that wanna change.

```javascript
var options = {
  type: 'all',          // all, group
  group: '',            // name of the group class (requires type: 'group')
  required: true,       // only required fields
  warn: true,           // highlights errored fields
  descriptions: true,   // shows errors descriptions (requires warn: true)
  lang: {},             // custom JSON (requires warn: true and descriptions: true)
  animations: true,     // shows animations on errored fields (requires warn: true)
  color: 'red',         // (hex) error color, (must include #, requires warn: true)
  align: 'right',       // messages alignment
  realTime: true,       // validates at typing (requires warn: true)
  debug: false          // shows debug info in console
}
```

## Messages customization:

These are the default messages. In the same way, they can be customized by passing only the ones that we want to change in the ```lang``` property from the [```options```](#options-definitions) object.

> If we use **[Translate.js](https://github.com/myei/translate.js)** this object must be included in each language.


```javascript
// These messages are in Spanish, because it's used more often
var validateJs = {
  min: 'La longitud de caracters mínima para este campo es de: ',
  max: 'La longitud de caracters máxima para este campo es de: ',
  numbers: 'Este campo solo permite números',
  letters: 'Este campo solo permite letras (sin espacios)',
  lettersSpaces: 'Este campo solo permite letras',
  lettersNumbers: 'Este campo permite letras y números (sin espacios)',
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
  file: 'Debe agregar al menos un archivo',
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
    min: 'Custom error message for min'
  }
};
```

Another way for doing this, is by using the property ```data-rule-msg``` (These rules are listed [here](#validation-rules))

```html
<!-- Customizing one rule -->
<input type="text" data-pattern="^[0-9]+$" data-pattern-msg="Custom message, only for this field and for the specified rule">

<!-- Customizing several rules -->
<input type="text" data-max="10" data-min="2" data-min-msg="Message for min rule" data-max-msg="Message for max rule" required>

<!-- Only shown if no rules are used -->
<input type="text" data-default-msg="Custom default message, only for this field">
```

## **HTML** configurations

By using ```options.type = 'all'``` will cover all of elements: ```input```, ```select```, ```textarea``` without distinctions

```html
<input type="text" />
```

By using ```options.type = 'all'``` and ```options.required = true```

```html
<input type="text" required/>
```

By using ```options.type = 'group'``` and  ```options.group = 'validate-me'```

```html
<input type="radio" name="gender" class="validate-me" />

<select name="gender" class="validate-me">
  <option value=""></option>
</select>
```

> By using ```options.required = true``` will only validate the **required** fields from the ```target```.


> The ```checkbox``` y ```radio``` fields must have the ```name``` property


## Validation rules

The default validation for the specified fields is **empty**, to customize this it can be added ```rules``` by using the ```data``` property, like this: ```data-rule```

```html
<input type="text" name="nombres" data-min="3" data-letters-spaces />

<textarea data-min="2" data-max="140" data-numbers />
```

> The ```rules``` can be used together and they are listed below:
> - ```min```: (int) minimum length for the field
> - ```max```: (int) maximum length for the field
> - ```letters```: only allows letters
> - ```letters-spaces```: only allows letters and blank spaces
> - ```numbers```: only allows numbers
> - ```letters-numbers```: allows letters and numbers
> - ```ip```: ip address e.g.: 127.0.0.1
> - ```passwd```: at least one uppercase, at least one lowercase, at least one number, at least one special character (!@#._-$%^&*)
> - ```email```: email address
> - ```url```: url e.g.: https://google.com
> - ```pattern```: (string) receives a custom regex, e.g.: ^[0-9]+$
> - ```optional```: it will be ignored while it's empty

## Custom rules:

Do you need to validate another thing that it's not within the available rules? No problem, you can add your own rules through this method `addRule(name, callback, message)`:

> `callback` considerations:
> - Receives two optional arguments `(e, arg)`:
>   - **e**: the DOM `element` as an argument (It represents: jQuery(field))
>   - **arg**: Argument for the rule (ej: data-my-rule="arg")
> - It must return a `boolean` value (being `true` when validation is successful)


```javascript
// Create the instansce first
var validate = Validate(opciones)

// Add as much as you need
validate.addRule('isPair', 
                  function (e) {
                      return parseInt(e.val()) % 2 === 0; 
                  }, 
                  'This number isn\'t pair');

// Then we can execute the validations
validate.itsOk();
```

Now in `HTML` we can assign these custom rules as we do it before `data-rule-name`:
```html
<input type="text" data-is-pair>
```



## Live validations

Also **keystrokes validations** can be added in order to increase the control over the fields (```role```) which contains a certain class (```target```):

> The availabe ```roles``` are listed below:
> - ```alphabetic```: only allows letters keys
> - ```numeric```: only allows numeric keys
> - ```alphanumeric```: allows numeric and letters keys


```javascript
Validate().addLive(role, target);

Validate().addLive('numeric', 'validate-me'); // e.g.: <input type="text" class="validate-me">
```

> If ```target``` it's not specified, the default value is validate-```role```
> e.g.: validate-alphabetic

```javascript
Validate().addLive('alphabetic'); // e.g.: <input type="text" class="validate-alphabetic">
```
