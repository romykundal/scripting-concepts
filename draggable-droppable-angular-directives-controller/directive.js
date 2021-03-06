/***
 GLobal Directives
 ***/

// Route State Load Spinner(used on page or content load)
App.directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar  
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        Metronic.scrollTop(); // scroll to the top on content load
                    }, 1000);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
App.directive('a',
        function () {
            return {
                restrict: 'E',
                link: function (scope, elem, attrs) {
                    if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                        elem.on('click', function (e) {
                            e.preventDefault(); // prevent link click for above criteria
                        });
                    }
                }
            };
        }).directive('numbers', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined)
                    return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
})

function firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}
// Check if value is in array with JavaScript
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/************Draggable directiveto any elements div and li tags ************/
App.directive('draggalehtml', function ($compile) {
    return {
      restrict:    'AE',
      //scope:       false,//{ recipes: '=draggalehtml' },
      link: function(scope, element, attrs) {
          var spanhtml = "";
          var template = "";
         
          scope.$watch('recipesList', function(recipe) {
              //console.log(recipe);
              if(typeof(recipe) !== 'undefined'){
            angular.forEach(recipe, function(recipe, key) {
               spanhtml += '<span id="recipe_'+recipe.id+'" class="recipes" >\n\
                            <div class="parts" id="'+recipe.id+'">'+firstToUpperCase(recipe.title)+'<trashrecipebutton></trashrecipebutton></div>\n\
                            </span>';
            });
        template = '<div  id="draggable-start" draggale class="ui-widget-content col-xs-4 col-sm-3 col-md-2 cont_drag_itemms"><div class="searh_drag_drop"><input type="text" placeholder="Search"/><button class="drag_sear_button"><i class="glyphicon glyphicon-search"></i></button></div>\n\
                        '+spanhtml+'</div>';
        
        scope.tips = "Creating scope varriable in directive";
        
        var $template = angular.element(template);
        var XHTML = $compile($template)(scope);
        //element.append(XHTML);
        angular.element(document.getElementById('draggablehtml')).append(XHTML);
        }
        
       });
       
      }
    };
    
});

App.directive('draggale', function ($compile) {
     return {
      restrict: "A",
      link: function(scope, element, attrs) {
        console.log("draggale In D");
        //console.log($(element).find("span.recipes"));
        
        var draggableElement = $(element).find("span.recipes");
        draggableElement.draggable({
                helper: "clone",
        });      
        
      }
    };

});


/************ Droppable Start html create dyinamic *********************/
App.directive("addbuttonsbutton", function(){
	return {
		restrict: "E",
		template: '<button addday type="button" class="btn btn-warning" >Plan <i class="fa fa-table" ></i></button>'
	}
});

App.directive("addday", function($compile){
    return {
      restrict:    'A',
      link:  function(scope, element, attrs){
        element.bind("click", function(){
            var daysCount= scope.mealplan.noOfDays;
            var day_tds = "";
            var dish_type = "";
            document.getElementById('droppable-div-start').innerHTML = "";
            //console.log(scope.meal.length);
            
            if (scope.meal.length === undefined || scope.meal.length === 0) {
                console.log("empty");
            }
            
            angular.forEach(scope.types, function(dishType, key) {
               //console.log(dishType.id);
                dish_type += '<div id="dish_'+ dishType.id +'" class="day break_drag drag_cont"><h5>'+ dishType.title +'</h5></div>';
            });
            day_tds += '<tr id="days">';
         for (var i=1; i<=daysCount; i++) {
             if(i % 7 == 1){
                day_tds += "</tr>"; 
             } 
              var dayModels = "day_"+i;
        day_tds += '<td id="'+ dayModels +'"  align="middle" ><div class="daycount" dayinfo="days">Day '+ i +'</div>'+ dish_type +'</td>';
           
             if( i % 7 == 0 ){
                day_tds += "<tr id='days'>"; 
             }
             var dishTypes_ = "dishTypes_"+i;
             scope[dishTypes_] = {};
            angular.forEach(scope.types, function(dishSlots, key) {
               //console.log("dish_"+dishSlots.id);
               var dishngModels = "dish_"+dishSlots.id;
               
               scope[dishTypes_][dishngModels] = [];
            });
             // Making data structure as object and array for days and dish types
           
            scope.meal[dayModels] = scope[dishTypes_];
             
         } // End For loop fon count of days
         //console.log(scope);
         
         day_tds += '</tr>';
        var Xhtml = $compile('<div>\n\
                    <table id="droppable-table" droppable cellspacing="0" class="table table-bordered table-striped">\n\
                    <tr><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr>\n\
                    '+day_tds+'</table></div>')(scope);
    angular.element(document.getElementById('droppable-div-start')).append(Xhtml);
    
//         var table_drop = document.getElementById("droppable-table");
//         var new_att = document.createAttribute("droppable");
//         table_drop.setAttributeNode(new_att);
         
        });
      }
    };
});

// Start Making Draggable directive to any elements td and div tags
App.directive('droppable', function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            console.log("droppable In D");
            
            var droppableEle = $(element).find("td div.day");
            droppableEle.droppable({
                drop: function (event, ui) {
                  //    var parenttd  = angular.element(element).attr('id');
                      
                  //    dropEle = event.target;
                  var dropId = ui.draggable.find("div.parts").attr('id');
                  var self = event.target;
                  
                  //self.find(".sortintodb").remove();
                  var dropElement = ui.draggable.html();
                    var day = event.target.parentNode.id;
                    var dish_id = event.target.id;
                if(isInArray(dropId, scope.meal[day][dish_id])) return;
                    // To Recipe pushing into perticuler dish type under perticuler day
                    scope.meal[day][dish_id].push(dropId);
                    // To dropped recipe element which dragged from recipe list into perticuler dish type under perticuler day
                    $(dropElement).appendTo(self) ;
                    
      //for (var i=1; i<=daysCount; i++) {
        
            /*angular.forEach(scope.dishTypes, function(dishs, key) {
               if(self.id == key)
               {
                   if(dishs.indexOf(dropId) > -1) {
                        return false; // Already Exist ( check to recipe exist )
                    } else {
                        dishs.push(dropId);
                        $(dropElement).appendTo(self) ; 
                    }
               }
            });
        if(i == day){
            var dayModels = "day_"+i;        
        }
            scope.days.dayModels = scope.dishTypes;
        
        }*/           
                //if (self.find('div').attr("[id=" + dropId + "]").length) return;
                //var day_nos = event.target.parentNode.id;
                //day = {};
                //day.push(dish);
                //days.push(event.target.parentNode.id);
                
                } //  End Dropped Function
            }) // End droppable code here
        }
    };
});

// End Making Draggable directive to any elements td and div tags
/************ Trash Button for delete recipe element from dish type sction in day td *********************/
App.directive("trashrecipebutton", function(){
	return {
		restrict: "E",
		template: '<i class="glyphicon glyphicon-trash" deleteElement></i>'
	}
});
App.directive("deleteElement", function($compile){
    return {
      restrict:    'A',
      link:  function(scope, element, attrs){
        element.bind("click", function(){
            
            console.log("Delete using trash");
            
        });
      }
    };
});

App.directive('droppableEdit', function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var plan = attrs.plan;
            console.log("droppable In D");
            
            var droppableEle = $(element).find("td div.day");
            droppableEle.droppable({
                drop: function (event, ui) {
                  //    var parenttd  = angular.element(element).attr('id');
                  //    console.log("parenttd=" + parenttd);
                  //    dropEle = event.target;
                  var dropId = ui.draggable.find("div.parts").attr('id');
                  var self = event.target;
                   //console.log(JSON.stringify(scope.days));
                  //self.find(".sortintodb").remove();
                  var dropElement = ui.draggable.html();
                    var day = event.target.parentNode.id;
                    var dish_id = event.target.id;
            
                    // To Recipe pushing into perticuler dish type under perticuler day
                    scope.meal[day][dish_id].push(dropId);
                    // To dropped recipe element which dragged from recipe list into perticuler dish type under perticuler day
                    $(dropElement).appendTo(self) ;
                    
      //for (var i=1; i<=daysCount; i++) {
        
            /*angular.forEach(scope.dishTypes, function(dishs, key) {
               if(self.id == key)
               {
                   if(dishs.indexOf(dropId) > -1) {
                        return false; // Already Exist ( check to recipe exist )
                    } else {
                        dishs.push(dropId);
                        $(dropElement).appendTo(self) ; 
                    }
               }
            });
        if(i == day){
            var dayModels = "day_"+i;        
        }
            scope.days.dayModels = scope.dishTypes;
        
        }*/           
                //if (self.find('div').attr("[id=" + dropId + "]").length) return;
                //var day_nos = event.target.parentNode.id;
                //day = {};
                //day.push(dish);
                //days.push(event.target.parentNode.id);
                
                } //  End Dropped Function
            }) // End droppable code here
        }
    };
});



