//
let entradas = [];


let item;
let divResultat;




$(setData);



function setData() {
    

    //pdf
    function PrintElem(elem) {
        Popup($(elem).html());
    }

    function Popup(data) {
        var myWindow = window.open('', 'my div', 'height=400,width=600');
        myWindow.document.write('<html><head><title>my div</title>');
        myWindow.document.write('<link rel="stylesheet" type="text/css" href="css/index.css"/>');
        myWindow.document.write('</head><body >');
        myWindow.document.write(data);
        myWindow.document.write('</body></html>');
        myWindow.document.close(); // necessary for IE >= 10

        myWindow.onload=function(){ // necessary if the div contain images

            myWindow.focus(); // necessary for IE >= 10
            myWindow.print();
            myWindow.close();
        };
    }

    document.getElementById("printPDF").addEventListener("click", function () {
        PrintElem("#printContainer");
       
    });











    //fin pdf



































    let boton1 = document.getElementById("buscar");
    boton1.addEventListener("click", procesarPeticion);
    let boton2 = document.getElementById("limpia");
    boton2.addEventListener("click", limpia);
    let boton3 = document.getElementById("añade");
    boton3.addEventListener("click", añadirEntrada)











    function procesarPeticion() {

        //translateCall
        let input = document.getElementById("input").value;
        let myApiUrl = "https://script.google.com/macros/s/AKfycbw10C-7_mXumBgcYvQ8UwwDkDP4zPA2iMzDxjQC6JqZBHFTVm6nv9SM0hBmy-qJW1Xm5g/exec?text=" + input

        $.ajax({
            async: true,
            crossDomain: true,
            url: myApiUrl,
            type: "application/json",
            method: "GET",

        }).done(function (response) {
            let translatedName = JSON.parse(response).translatedText;
            search(translatedName)

        }).fail(processarError);
    }




    function search(name) {


        var query = name;
        $.ajax({

            Zasync: true,
            crossDomain: true,
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
            headers: { 'X-Api-Key': 'cSS9TIA2LGWsd0zoDAI/IQ==kZfOtZxiJjiWD3B2' },
            contentType: 'application/json',
            success: function (result) {
                item = result['items'][0];

                if (typeof item === 'undefined') {
                    alert(document.getElementById("input").value + " no es un alimento que se encuentre en la base de datos")
                } else {
                    renderFound(item, name);
                }



            },
            error: function ajaxError(jqXHR) {
                console.log("error tipo 1")
                console.error('Error: ', jqXHR.responseText);
            }
        });


    }




    function processarError(jqXHR, statusText, error) {
        console.log(error, statusText);
    }

    function renderFound(item) {
        deleteInfo();
        item.nombre = document.getElementById("input").value;
        let html = "<h1>" + item.nombre + "(" + item.name + ")</h1>" +
            "<h3>Composición por 100g</h3>\n" +
            "Calorias Totales: " + item.calories + "Kcal<br>" +
            "Proteina: " + item.protein_g + "g<br>" +
            "Carbohidratos: " + item.carbohydrates_total_g + "g<br>" +
            "&#8627 de los cuales azucares: " + item.sugar_g + "g<br>" +
            "Grasas: " + item.fat_total_g + "g<br>" +
            "&#8627de las cuales saturadas: " + item.fat_saturated_g + "g<br>" +
            "&#8627Colesterol: " + item.cholesterol_mg + "mg<br>" +
            "Fibra: " + item.fiber_g + "g<br>" +
            "sodio: " + item.sodium_mg + "mg<br>" +
            "potasio: " + item.potassium_mg + "mg<br>"
        let showDiv = document.createElement("div");
        showDiv.setAttribute("class", "showItem")

        document.getElementById("info").append(showDiv)
        showDiv.innerHTML = html;
    }

    function deleteInfo() {
        let div = document.getElementById("info").firstChild
        if (div != null) {
            div.remove();
        }
    }

    function limpia() {
        deleteInfo();
        item = undefined;
    }

    function añadirEntrada() {
        if (item === undefined) {
            alert("Antes de añadir es necesario buscar un alimento y tenerlo visualizado");
            return;
        }
        let cantidad = document.getElementById("inputNumber").value;
        if (cantidad != null && cantidad > 0) {
            item.cantidad = parseInt(cantidad);
            añadir(item);
        } else {
            alert("los gramos no pueden estar vacios o en 0");
        }

    }

    function añadir(entrada) {

        entrada.id = entradas.length + 1;
        entradas.push(entrada);

        let divTable = document.getElementById("tablaBody");
        divTable.innerHTML += `<tr id= ${entrada.id} + "'>
        <td>${entrada.nombre}</td>
        <td>${entrada.cantidad}</td>
        <td>${((entrada.calories/100)*entrada.cantidad).toFixed(2)} </td>
        <td>${((entrada.protein_g/100)*entrada.cantidad).toFixed(2)} </td>
        <td>${((entrada.carbohydrates_total_g/100)*entrada.cantidad).toFixed(2)} </td>
        <td>${((entrada.fat_total_g/100)*entrada.cantidad).toFixed(2)} </td>
        <td>${((entrada.sugar_g/100)*entrada.cantidad).toFixed(2)} </td>
        <td>${((entrada.fiber_g/100)*entrada.cantidad).toFixed(2)} </td>
        <td>${((entrada.sodium_mg/100)*entrada.cantidad).toFixed(2)} </td>
        <td><img src="trash.png" class="trash" onclick="borrar(${entrada.id})"></td> 
        
        
        </tr>`;

        calcTotal();
    }





}

function calcTotal() {
    let divTotalCantidad = document.getElementById("totalCantidad");
    let divTotalKcal = document.getElementById("totalKcal");
    let divTotalProteina = document.getElementById("totalProteina");
    let divTotalGrasas = document.getElementById("totalGrasas");
    let divTotalCarbohidratos = document.getElementById("totalCarbohidratos");
    let divTotalAzucares = document.getElementById("totalAzucares");
    let divTotalFibra = document.getElementById("totalFibra");
    let divTotalSodio = document.getElementById("totalSodio");

    let totalCantidad = 0;
    let totalKcal = 0;
    let totalProteina = 0;
    let totalGrasas = 0;
    let totalCarbohidratos = 0;
    let totalAzucares = 0;
    let totalFibra = 0;
    let totalSodio = 0;




    for (let i in entradas) {
        totalCantidad += entradas[i].cantidad;
        totalKcal += entradas[i].calories / 100 * entradas[i].cantidad;
        totalProteina += entradas[i].protein_g / 100 * entradas[i].cantidad;
        totalGrasas += entradas[i].fat_total_g / 100 * entradas[i].cantidad;
        totalCarbohidratos += entradas[i].carbohydrates_total_g / 100 * entradas[i].cantidad;
        totalAzucares += entradas[i].sugar_g / 100 * entradas[i].cantidad;
        totalFibra += entradas[i].fiber_g / 100 * entradas[i].cantidad;
        totalSodio += entradas[i].sodium_mg / 100 * entradas[i].cantidad;
    }



    divTotalCantidad.innerHTML = `${totalCantidad}g`;
    divTotalKcal.innerHTML = `${totalKcal.toFixed(0)}g`;
    divTotalProteina.innerHTML = `${totalProteina.toFixed(2)}g`;
    divTotalGrasas.innerHTML = `${totalGrasas.toFixed(2)}g`;
    divTotalCarbohidratos.innerHTML = `${totalCarbohidratos.toFixed(2)}g`;
    divTotalAzucares.innerHTML = `${totalAzucares.toFixed(2)}g`;
    divTotalFibra.innerHTML = `${totalFibra.toFixed(2)}g`;
    divTotalSodio.innerHTML = `${totalSodio.toFixed(2)}mg`;






}
function borrar(id) {
    let div = document.getElementById(id);
    let index = entradas.findIndex(x => x.id === id);
    entradas.splice(index, 1);
    div.remove();
    calcTotal();
}
