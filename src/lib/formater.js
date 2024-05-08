function formater(text) {
 // Reemplazar <div id='ads'>do not write anything here</div> por una cadena vacía
 const cleanString = text.replace(/<div id='ads'>do not write anything here<\/div>/g, "");

 // Eliminar los \n
 const cleanString2 = cleanString.replace(/\n/g, "");

 // Agregar comillas dobles a los nombres de las propiedades
 const quotedProps = cleanString2.replace(/(\w+):/g, '"$1":');

 // Agregar comillas dobles a los valores de las propiedades que son strings
 const quotedValues = quotedProps.replace(/:(\s*)(".*?")/g, ': "$2"');

 // Parsear el JSON
 return JSON.parse(quotedValues);
}