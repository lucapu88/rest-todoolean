//Creazione di una piccola applicazione web per gestire una lista di "todo".
$(document).ready(function(){
  var template_html = $('#myTemplate').html();//recupero il codice html del template
  var template_function = Handlebars.compile(template_html);//do in pasto a handlebars il codice html
  creaLista();
$('.add').click(function(){ //al click sul pulsante aggiungi
  var nuovoInserimento = $('.myInput').val().trim(); //prendo ciò che l'utente scrive
  if (nuovoInserimento.length > 0) { //se ho scritto qualcosa dentro l'input
    $('.myInput').val(' '); //resetto l'input ad ogni ricerca
    aggiungiLista(nuovoInserimento); //vado a chiamare la mia funzione passandogli come parametro ciò che viene inserito nell'input
  }
});
$('.myInput').keypress(function(event) { //quando si è in posizione dell'input e viene premuto INVIO
    var nuovoInserimento = $('.myInput').val().trim(); //prendo ciò che l'utente scrive
    if (event.which == 13 && nuovoInserimento != 0) { // se viene premuto INVIO (che corrisponde al numero 13 della mappatura dei tasti) e se nell'input c'è scritto qualcosa
      $('.myInput').val(' '); //faccio le stesse e identiche cose che vengono fatte anche con il click più sopra
      aggiungiLista(nuovoInserimento);
    }
  });
$(document).on('click', '.delete', function(){ //al click sull'icona del bidone della spazzatura
  var deleteId = $(this).parent().attr('data-id'); //su quel singolo elemento cliccato (icona bidone spazzatura) vado a prendermi l'attributo del data assegnato al padre (cioè il data dell'li, perchè l'icona cliccata è dentro l'li e quindi è figlio). Quindi recupero l'id che serve per il metodo delete.
  cancellaLista(deleteId); //chiamo la mia funzione passandogli come argomento l'id recuperato prima
});
$(document).on('click', '.edit', function(){ //al click sull'icona del della matita
  var liTodo = $(this).parent(); //recupero il tag dell'li
  liTodo.find('.elemento').addClass('hidden'); //nascondo il tag dell'li
  liTodo.find('.editText').addClass('active'); //mostro l'altro input per modificarlo
  liTodo.find('.edit').addClass('hidden'); //nascondo l'icona della matita
  liTodo.find('.save').addClass('active'); //mostro il floppy disk
});
$(document).on('click', '.save', function(){ //al click sull'icona del del floppy disk
  var editId = $(this).parent().attr('data-id'); //come ho fatto con delete, faccio lo stesso ma sull'icona della matita
  var liTodo = $(this).parent(); //recupero il tag dell'li
  var editText = liTodo.find('.editText').val(); //del tag dell'li, cerco l'input all'interno, e mi prendo quello che ci scrive l'utente
  modificaLista(editId, editText); //chiamo la mia funzione passandogli come argomento l'id del todo da modificare e il testo dell'input che l'utente andrà a scrivere
});



//------------------------------------------FUNZIONI-----------------------------------------------------
//funzione che tramite una chiamata ajax mi popola il template e mi appende una lista
function creaLista() {
  $.ajax({
    url : 'http://157.230.17.132:' + PORTA,
    method : 'GET', //chiedo dei dati
    success : function(data) {
      $('#lista-container').empty();
      for (var i = 0; i < data.length; i++) { //ciclo il contenuto della mia porta
        var context = { //creo il contenuto che andrà dentro l'li
          elemento : data[i].text, //dentro l'li ci va ciò che c'è scritto in text
          id : data[i].id //nel data dell'li ci metto l'id del text perchè mi servirà per il method delete
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

//funzione che tramite una chiamata ajax mi aggiunge un elemento alla lista
function aggiungiLista(parola) {
  $.ajax({
    url : 'http://157.230.17.132:' + PORTA,
    method : 'POST', //invio dei dati
    data : {
      text : parola //creo un nuovo contenuto (che sarà quello digitato dall'utente) che andrà dentro l'li in aggiunta a quelli che già c'erano
    },
    success : function(data) {
      creaLista(); //richiamo la funzione che mi stampa il template aggiornato con il nuovo contenuto che ha digitato l'utente
    },
    error : function() {
          alert('aggiungiLista error');
    }
  });
}

//funzione che tramite una chiamata ajax mi cancella un elemento selezionato della lista
function cancellaLista(id) {
  $.ajax({
    url : 'http://157.230.17.132:' + PORTA + '/' + id, //aggiungo l'id che mi viene passato come argomento
    method : 'DELETE', //elimino dei dati (cioè tutto ciò che fa parte dell'id passato in funzione)
    success : function(data) {
        creaLista(); //richiamo la funzione che mi stampa il template aggiornato senza l'elemento che ho scelto di eliminare
    },
    error : function() {
          alert('cancellaLista error');
    }
  });
}

//funzione che tramite una chiamata ajax mi modifica un elemento selezionato della lista
function modificaLista(id, parola) {
  $.ajax({
    url : 'http://157.230.17.132:' + PORTA + '/' + id, //aggiungo l'id che mi viene passato come argomento
    method : 'PUT', //modifico/invio dei dati
    data : {
      text : parola //creo un nuovo contenuto (che sarà quello digitato dall'utente una volta cliccata la matita) che andrà dentro l'li al posto di quello che già c'era
    },
    success : function(data) {
        creaLista(); //richiamo la funzione che mi stampa il template aggiornato con il contenuto modificato
    },
    error : function() {
          alert('modificaLista error');
    }
  });
}

});
