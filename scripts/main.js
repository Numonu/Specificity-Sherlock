import { calculate, compare } from './node_modules/specificity/dist/specificity.mjs';
//variables logicas
let selectorsArray;
let docker = [];
//Obtencion de elementos html
const userInput = document.getElementById("user-input");
const calculateButton = document.getElementById("calculate-button");
const clearButton = document.getElementById("clear-button");

const resultsEmpty = document.getElementById("results-empty");
const table = document.getElementById("table");
//Eventos
calculateButton.addEventListener("click", () => {
    //obtenemos un arreglo con todos los selectores
    selectorsArray = (getAllSelectors(userInput.value) || []);
    //si el arreglo contiene al menos un selector continuamos
    if (selectorsArray.length >= 1) {
        //limpiamos cualquier resultado anterior para generar uno nuevo
        clear(false);
        //quitamos el prompt de resultado vacio
        resultsEmpty.style.display = "none";
        //mostramos la tabla de resultados
        table.style.display = "initial";
        //ordenamos el arreglo por especificidad
        selectorsArray = selectorsArray.sort(compare, 0);
        //
        selectorsArray.forEach(element => {
            //declaramos informacion del selector
            const calc = calculate(element);
            let selector = calc[0].selector;
            let specificity = calc[0].specificityArray;
            //incluimos los datos en la tabla
            addSelectorData(table, selector, specificity[1], specificity[2], specificity[3],
                (specificity[1] + specificity[2] + specificity[3]));
            //en caso se encuentren dos selectores separados por ","
            if (calc[1] != undefined) {
                //declaramos informacion del selector
                let selector = calc[1].selector;
                let specificity = calc[1].specificityArray;
                //incluimos los datos en la tabla
                addSelectorData(table, selector, specificity[1], specificity[2], specificity[3],
                    (specificity[1] + specificity[2] + specificity[3]));
            }
        });
    }
})

clearButton.addEventListener("click", clear)

//Funciones 
function getAllSelectors(str) {
    let result = str;
    //formateamos el texto
    result = result.replace(/\s/g, "");
    //encontramos los posibles selectores
    result = result.match(/(?<=}?)[^@{}/%*]+?(?={)/g);
    //filtramos los selectores sospechosos "keyfram" "svg"
    result = result.filter(item => !/^keyframe/.test(item));
    //separamos los selectores combinados "h1,h2"
    result.forEach((element, index) => {
        if (/,/g.test(element)) {
            result.splice(index, 1, ...result[index].split(","));
        }
    });
    //
    console.log(result); return result;
}
function addSelectorData(objetivo, ...properties) {
    //creamos el contenedor
    let container = document.createElement("div");
    container.classList.add("table__row");
    //recorremos las propiedades
    for (const i of properties) {
        //creamos el elemento
        let temp = document.createElement("div");
        temp.classList.add("table__element");
        //incluimos su valor
        temp.innerHTML = i;
        //finalmente agregamos el elemento
        container.appendChild(temp);
    }
    //guardamos el elemento en un historial para limpiarlo luego
    docker.push(container);
    //finalmente incluimos todo el elemento en nuestra tabla
    objetivo.appendChild(container);
}
function clear(clearAll = true) {
    if (clearAll) {
        //vaciamos el input
        userInput.value = "";
        //mostramos los prompts iniciales
        resultsEmpty.style.display = "initial";
        table.style.display = "none";
    }
    //limpiamos el historial de elementos
    docker.forEach(element => {
        try { table.removeChild(element); }
        catch { console.log(`El elemento  ${element} no se puede eliminar`); }
    });
    //no olvides limpiar el docker
    docker = [];
}