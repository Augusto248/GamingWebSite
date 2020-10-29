$(document).ready(function()
{
  callAjaxItemsConsola();
  callAjaxItemsGeneros();
  callAjaxItemsDistribuidor();
  callAjaxItemsDesarrollador();
  var btnSearch=$(".btnSearch").click(callAjaxSearchGames);
  var btn=$(".btnShowMore").click(showHiden);
  $(".closeModal").click(closePopUp);

  $(btn).hide();
});

categorias=[];

function eventoBuscador(search_value)
{
  //OCULTO EL BUSCADOR.
  $(".buscador").hide();
  //OCULTO EL BOTON DE BUSCAR.
  $(".btnSearch").hide();
  //CREO EL ELEMENTO.
  var element=$("<p>"+search_value+"</p>")
  cambiarEstiloItemSelectedSearcher(element);
  //EVENTO CLICK.
  $(element).click(show);
  //AGREGO EL ELEMENTO.
  $(".box-busqueda").append(element);

 
}

function callAJaxInfoGameSelected(gamePK)
{
  var jqxhr = $.get( "https://api.rawg.io/api/games/"+gamePK+"", function() 
  {
    })
      .done(function(data) 
      {
          $(".fondo").attr("src", data.background_image);
          $(".imagen").attr("src", data.background_image);
          var title=$("<h1>"+data.name+"</h1>");
          $(".gameInfo").append(title);
          $(".gameInfo").append(data.description);

      })
      .fail(function() {
        alert( "error" );
      });
    
}


function eventInfo()
{
  //MUESTRO EL POPUP
  $("#popUp").css("display","block");

  //QUITO EL SCROLL DEL BODY CUANDO SURGE EL POPUP.
  $('body').css('overflow', 'hidden');

  //DESDE ACA VOY A LLENAR EL POPUP DE INFORMACION CON AJAX.

  //OBTENGO LOS ELEMENTOS HERMANOS DEL BOTON INFO, Y SOLO OBTENGO EL HERMANO
  //CON LA CLASE ."gameNAME".
  var gameName=$(this).attr('id');

  console.log(gameName);
  callAJaxInfoGameSelected(gameName);

}

function closePopUp()
{
  //DEJO DE MOSTRAR EL POPUP.
  $("#popUp").css("display","none");

  //MUESTRO EL SCROLL DEL BODY CUANDO DESAPARECE EL POPUP.
  $('body').css('overflow', 'scroll');

  //SETEO TODO EN VACIO.
  $(".fondo").attr("src", "");
  $(".imagen").attr("src", "");

  $(".gameInfo").empty();

}


function show()
{
  var resultado=$(".hiddenSearcher");
  if($(resultado).css("color")=="rgb(255, 255, 255)")
  {
    var valor="search="+$(resultado).html();
    //ELIMINO EL ELEMENTO RESULTADO.
    $(resultado).remove();
    //QUITO AL ARRAY DE STRINGS.
    removeArray(valor);
    console.log(valor);

    //MUESTRO EL BUSCADOR.
    $(".buscador").show();
    //MUESTRO EL BOTON.
    $(".btnSearch").show();
  }
}

function callAjaxSearchGames()
{

  var VALUES="";
  for(var i=0;i<categorias.length;i++){
    if(i==0)
    {
      VALUES=VALUES+categorias[i];
    }
    else
    {
      VALUES=VALUES+"&"+categorias[i];
    }
  }

  if(VALUES!="")
  {
      VALUES=VALUES+"&";
  }


  var search=$(".buscador");
  search_value=$(search).val();


  console.log(VALUES);
  console.log("search="+search_value);

  var jqxhr = $.get( "https://api.rawg.io/api/games?"+VALUES+"search="+search_value+"", function() 
  {
    })
      .done(function(data) 
      {
        var divGames=$(".box-games");
        $(divGames).empty();

        var juegos=data.results;
        var i=1;
        juegos.forEach(element => 
          {
              añadirNodosJuegos(element.background_image,element.name,i);
              i++;
        });
        console.log(data);
        categorias.push("search="+search_value);
        eventoBuscador(search_value);
        añadirHeaderSection();

        var btn=$(".btn").show();

        /*ASIGNO EL EVENTO PARA EL BOTON DE INFO.*/
        botonInfoEvent();

      })
      .fail(function() {
        alert( "error" );
      });
    
}

function showHiden()
{
  //OBTENGO TODOS LOS ARTCILES Y LOS SETEO TODOS EN SHOW.
   var articles=$(".box-games article");
  //ESCONDO EL BOTON "MOSTRAR MAS"
   var btn=$(".btnShowMore").hide();
   $(articles).show();

}


function callAjaxItemsConsola()
{

  var jqxhr = $.get( "https://api.rawg.io/api/platforms", function() 
  {
    })
      .done(function(data) {
        var consolas=data.results;
        var i=0;
        
        consolas.forEach(element => 
          {
              if(i<=5)  /*QUE SOLO MUESTRE 5 CONSOLAS */
              {
              añadirNodosItemsConsola(element.name,element.id);
              }
              i++;
        });

        var elem= $(".itemsConsola li");    
        //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
        for(i=0;i<elem.length;i++)
        {
            $(elem[i]).click(eventoConsola);
        }
        
      })
      .fail(function() {
        alert( "error" );
      });
}

function eventoConsola()
{
  
  if($(this).css("padding")=="3px")
  {
    mostrarConsolas(this);
    var id=$(this).attr("id");
    //QUITO AL ARRAY DE STRINGS.
    removeArray(id);
  }
  else
  {
  //Elimino todo lo que contenga el div.
  var divGames=$(".box-games");
  divGames.empty();
  ocultarConsolas(this);
  //OCULTO EL BOTON MOSTRAR MAS.
  var btn=$(".btnShowMore").hide();
  var id=$(this).attr("id");
  //AGREGO AL ARRAY DE STRINGS.
  addArray(id);

  callAjaxCategorySelected(id);
  console.log(id);
  }
}

function addArray(categoria_id)
{
    categorias.push(categoria_id);
}

function removeArray(categoria_id)
{
    categorias.splice(categorias.indexOf(categoria_id), 1); 
}

function ocultarConsolas(selected)
{
  cambiarEstiloItemSelected(selected)
  var elem= $(".itemsConsola li");    
  //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
  for(i=0;i<elem.length;i++)
  {
      if(elem[i]!=selected)
      {
        $(elem[i]).hide();
      }   
  }
}

function cambiarEstiloItemSelectedSearcher(selected)
{
  $(selected).css({"color":"white", "background-color":"rgb(180, 12, 12)",
"border-radius":"3px", "padding":"3px"});
$(selected).addClass("hiddenSearcher");
}

function cambiarEstiloItemSelected(selected)
{
  $(selected).css({"color":"white", "background-color":"rgb(180, 12, 12)",
"border-radius":"3px", "padding":"3px"});
$(selected).addClass("hidden");
}

function cambiarEstiloItemDeselected(selected)
{
  $(selected).css({"color":"black", "background-color":"transparent",
  "border-radius":"0px", "padding":"0px"});
  $(selected).removeClass("hidden");

}

function mostrarConsolas(selected)
{
  cambiarEstiloItemDeselected(selected);
    var elem= $(".itemsConsola li");    
    //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
    for(i=0;i<elem.length;i++)
    {
        if(elem[i]!=selected)
        {
          $(elem[i]).show();
        }   
    }
}


function eventoGenero()
{

  if($(this).css("padding")=="3px")
  {
    mostrarGeneros(this);
    var id=$(this).attr("id");
    //QUITO AL ARRAY DE STRINGS.
    removeArray(id);
  }
  else
  {
    //Elimino todo lo que contenga el div.
  var divGames=$(".box-games");
  divGames.empty();
  ocultarGeneros(this);
  var id=$(this).attr("id");
  addArray(id);

  callAjaxCategorySelected(id);
  console.log(id);
  }
}

function ocultarGeneros(selected)
{
  cambiarEstiloItemSelected(selected);
  var elem= $(".itemsGenero li");    
  //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
  for(i=0;i<elem.length;i++)
  {
      if(elem[i]!=selected)
      {
        $(elem[i]).hide();
      }   
  }
}

function mostrarGeneros(selected)
{
    cambiarEstiloItemDeselected(selected);
    var elem= $(".itemsGenero li");    
    //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
    for(i=0;i<elem.length;i++)
    {
        if(elem[i]!=selected)
        {
          $(elem[i]).show();
        }   
    }
}

function eventoDistribuidor()
{
  
  if($(this).css("padding")=="3px")
  {
    mostrarDistribuidor(this);
    var id=$(this).attr("id");
    //QUITO AL ARRAY DE STRINGS.
    removeArray(id);
  }
  else
  {
    //Elimino todo lo que contenga el div.
  var divGames=$(".box-games");
  divGames.empty();
  ocultarDistribuidor(this);
  var id=$(this).attr("id");
  addArray(id);

  callAjaxCategorySelected(id);
  console.log(id);
  }
}

function ocultarDistribuidor(selected)
{
  cambiarEstiloItemSelected(selected);
  var elem= $(".itemsDistribuidor li");    
  //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
  for(i=0;i<elem.length;i++)
  {
      if(elem[i]!=selected)
      {
        $(elem[i]).hide();
      }   
  }
}

function mostrarDistribuidor(selected)
{
  cambiarEstiloItemDeselected(selected);
    var elem= $(".itemsDistribuidor li");    
    //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
    for(i=0;i<elem.length;i++)
    {
        if(elem[i]!=selected)
        {
          $(elem[i]).show();
        }   
    }
}

function eventoDesarrolladores()
{
  
  if($(this).css("padding")=="3px")
  {
    mostrarDesarrolladores(this);
    var id=$(this).attr("id");
    //QUITO AL ARRAY DE STRINGS.
    removeArray(id);
  }
  else
  {
    //Elimino todo lo que contenga el div.
  var divGames=$(".box-games");
  divGames.empty();
  ocultarDesarrolladores(this);
  var id=$(this).attr("id");
  addArray(id);

  callAjaxCategorySelected(id);
  console.log(id);
  }
}

function ocultarDesarrolladores(selected)
{
  cambiarEstiloItemSelected(selected);
  var elem= $(".itemsDesarrolladores li");    
  //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
  for(i=0;i<elem.length;i++)
  {
      if(elem[i]!=selected)
      {
        $(elem[i]).hide();
      }   
  }
}

function mostrarDesarrolladores(selected)
{
  cambiarEstiloItemDeselected(selected);
    var elem= $(".itemsDesarrolladores li");    
    //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
    for(i=0;i<elem.length;i++)
    {
        if(elem[i]!=selected)
        {
          $(elem[i]).show();
        }   
    }
}

function callAjaxCategorySelected()
{

  var VALUES="";
  for(var i=0;i<categorias.length;i++){
    if(i==0)
    {
      VALUES=VALUES+categorias[i];
    }
    else
    {
      VALUES=VALUES+"&"+categorias[i];
    }
  }
        
  var jqxhr = $.get( "https://api.rawg.io/api/games?"+VALUES+"", function() 
  {
    })
      .done(function(data) {
        var juegos=data.results;
        var i=1;
        añadirHeaderSection();

        juegos.forEach(element => 
          {
              añadirNodosJuegos(element.background_image,element.name,i,element.id);            
              i++;
        });

        botonInfoEvent();


        //Muestro el boton.
        if(i>10)
        {
          var btn=$(".btnShowMore").show();
        }
        //test();


      })
      .fail(function() {
        alert( "error" );
      });
}

function botonInfoEvent()
{
   var btnInfo=$(".infoIcon");
   for(var i=0;i<btnInfo.length;i++)
   {
     $(btnInfo[i]).click(eventInfo);
   }
}



function callAjaxItemsGeneros()
{
  
  var jqxhr = $.get( "https://api.rawg.io/api/genres", function() 
  {
    })
      .done(function(data) {
        var generos=data.results;
        var i=0;
        generos.forEach(element => 
          {
              if(i<=5)  /*QUE SOLO MUESTRE 5 CONSOLAS */
              {
                añadirNodosItemsGeneros(element.name,element.id);
              }
              i++;

        });

        var elem= $(".itemsGenero li");    
        //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
        for(i=0;i<elem.length;i++)
        {
            $(elem[i]).click(eventoGenero);
        }

      })
      .fail(function() {
        alert( "error" );
      });
}

function callAjaxItemsDistribuidor()
{
  
  var jqxhr = $.get( "https://api.rawg.io/api/publishers", function() 
  {
    })
      .done(function(data) {
        var distribuidores=data.results;
        var i=0;
        distribuidores.forEach(element => 
          {
              if(i<=5)  /*QUE SOLO MUESTRE 5 CONSOLAS */
              {
                añadirNodosItemsDistribuidor(element.name,element.id);
              }
              i++;
        });

        var elem= $(".itemsDistribuidor li");    
        //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
        for(i=0;i<elem.length;i++)
        {
            $(elem[i]).click(eventoDistribuidor);
        }

      })
      .fail(function() {
        alert( "error" );
      });
}
function callAjaxItemsDesarrollador()
{
  
  var jqxhr = $.get( "https://api.rawg.io/api/developers", function() 
  {
    })
      .done(function(data) {
        var desarrolladores=data.results;
        var i=0;
        desarrolladores.forEach(element => 
          {
              if(i<=5)  /*QUE SOLO MUESTRE 5 CONSOLAS */
              {
                añadirNodosItemsDesarrollador(element.name,element.id);
              }
              i++;

        });

        var elem= $(".itemsDesarrolladores li");    
        //LE ASIGNO EL EVENTO CLICK A TODOS LOS <LI>.
        for(i=0;i<elem.length;i++)
        {
            $(elem[i]).click(eventoDesarrolladores);
        }

      })
      .fail(function() {
        alert( "error" );
      });
}


function añadirNodosItemsConsola(itemsName,id)
{
    var divItemsConsola=$(".itemsConsola");
    divItemsConsola.append("<li id=platforms="+id+">"+itemsName+"</li>");
}

function añadirNodosItemsGeneros(itemsName,id)
{
    var divItemsConsola=$(".itemsGenero");
    divItemsConsola.append("<li id=genres="+id+">"+itemsName+"</li>");
}

function añadirNodosItemsDistribuidor(itemsName,id)
{
    var divItemsConsola=$(".itemsDistribuidor");
    divItemsConsola.append("<li id=publishers="+id+">"+itemsName+"</li>");
}

function añadirNodosItemsDesarrollador(itemsName,id)
{
    var divItemsConsola=$(".itemsDesarrolladores");
    divItemsConsola.append("<li id=developers="+id+">"+itemsName+"</li>");
}

//AGREGAR ICONITOS A LAS PLATAFORMAS.
function añadirNodosJuegos(img,name,i,pk)
{
    
    var divGames=$(".box-games");
    var nameUpper = name.toUpperCase();
    if(i<=10)
    {
      divGames.append("<article>"+"<div class=juego>"+"<img class=imgPhoto src="+img+"></img>"
      +"<img id="+pk+" class=infoIcon src=assets/img/info3.png></img>"
      +"<img class=favoriteIcon src=assets/img/heart.png></img>"+"<p class=gameName>"+nameUpper+"</p>"+"<p class=plataforma>asd</p>"+"</div>"+"</article>");
    }
    
    //ESTOS ARTICULOS ESTARAN OCULTOS.
    else
    {
      var article=$("<article>"+"<div class=juego>"+"<img class=imgPhoto src="+img+"></img>"
      +"<a href=#popUp><img class=infoIcon src=assets/img/info3.png></img></a>"+"<p class=gameName>"+nameUpper+"</p>"+"<p class=plataforma>asd</p>"+"</div>"+"</article>").hide();
      divGames.append(article);
    }
}

function añadirHeaderSection()
{
  //Vacio el espacio del headersection.
  var divGames=$(".headerSections").empty();

  var name=armarHeaderSection();

  var divGames=$(".headerSections");
  var headerSection=$("<H3 class=headerSection>"+name+"</H3>");
  var titleGroupOptions=$("<H3 class=ordenar>ORDENAR POR</H3>");
  var groupOptions=$("<select class=groupOptions><optgroup label=Opciones><option value=vasd>Fecha de Lanzamiento</option><option value=>Rating</option><option value=vasds>Alfabeticamente</option></optgroup></select>");
  divGames.append(headerSection,titleGroupOptions,groupOptions);

}

function armarHeaderSection()
{
  //le asingo un valor a cada categoria.
  var i=0;
  //Obtengo los "li" que tengan color blanco.
  var liBusqueda=$('.aside-nav .box-busqueda .hiddenSearcher[style*="color: white"]').text();
  if(liBusqueda!="")
  {
    i=5;
    return liBusqueda
  }

  var liConsola=$('.aside-nav .box-consola ul li[style*="color: white"]').text();
  if(liConsola!="")
  {
    i=4;
    return liConsola
  }

  var liGenero=$('.aside-nav .box-genero ul li[style*="color: white"]').text();
  if(liGenero!="")
  {
    i=3;
    return liGenero
  }

  var liDistribuidor=$('.aside-nav .box-distribuidor ul li[style*="color: white"]').text();
  if(liDistribuidor!="")
  {
    i=2;
    return liDistribuidor
  }

  var liDesarrolladores=$('.aside-nav .box-desarrolladores ul li[style*="color: white"]').text();
  if(liDesarrolladores!="")
  {
    i=1;
    return liDesarrolladores;
  }




  
  

}

// agregue a la funcion añadirNodosJuegos()
// +"<a href='compartir.html'>"+"<img src='./img/compartir.png' alt='Compartir con un amigo'>"+"</a>"
// para que cada juego se inserte con un boton para compartir
