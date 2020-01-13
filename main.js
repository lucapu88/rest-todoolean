//Creazione di una piccola applicazione web per gestire una lista di "todo".
$(document).ready(function(){
  var template_html = $('#myTemplate').html();//recupero il codice html del template
  var template_function = Handlebars.compile(template_html);//do in pasto a handlebars il codice html
  creaLista();

$('.add').click(function(){
  var nuovoInserimento = $('.myInput').val(); //prendo ciò che l'utente scrive
  $('.myInput').val(' '); //resetto l'input ad ogni ricerca
  aggiungiLista(nuovoInserimento);

});


//------------------------------------------FUNZIONI-----------------------------------------------------
//funzione che tramite una chiamata ajax mi popola il template
function creaLista() {
  $.ajax({
    url : 'http://157.230.17.132:' + PORTA,
    method : 'GET', //chiedo dei dati
    success : function(data) {
      $('#lista-container').empty();
      for (var i = 0; i < data.length; i++) { //ciclo il contenuto della mia porta
        var context = { //creo il contenuto che andrà dentro l'li
          elemento : data[i].text, //dentro l'li ci va ciò che c'è scritto in text
          id : data[i].id //nel data dell'li ci metto l'id del text per tenerne traccia
        }
        var liContenuto = template_function(context); //creo con la funzione di handlebars il contenuto dell'li nel template
        $('#lista-container').append(liContenuto); //appendo il template dentro l'ul
      }
    },
    error : function() {
          alert('creaLista error');
    }
  });
}

function aggiungiLista(parola) {
  $.ajax({
    url : 'http://157.230.17.132:' + PORTA,
    method : 'POST', //invio dei dati
    data : {
      text : parola //creo un nuovo contenuto (che sarà quello digitato dall'utente) che andrà dentro l'li in aggiunta a quelli che già c'erano
    },
    success : function(data) {
      creaLista(); //richiamo la funzione che mi stampa il template con il nuovo contenuto che ha digitato l'utente
    },
    error : function() {
          alert('aggiungiLista error');
    }
  });
}


});
