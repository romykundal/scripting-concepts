App.controller('dragdropCtrl', function ($state, $http, Upload, $rootScope, $timeout, $scope, Config, MealPlanCollection, recipeCollection, DishTypeCollection, toaster, toasterOptions) {
    
    $scope.getRecipes = function () {
        recipeCollection.get().$promise.then(function (res) {
            $scope.recipesList = res.data.data;   
        });
    }
   
    $scope.meal = {};
   
   $scope.getDishType = function () {
       DishTypeCollection.get().$promise.then(function (res) {
            
           $scope.types = res.data.data;
           
        });
    }
   
   
   
  //console.log($scope);
/***************Start with divs and td************************/
/*
$(function() {
    $( "#draggable span" ).draggable({
        helper: "clone",
    });

    $('#droppable td div#day').droppable({
      drop: function (event, ui) {
            var parenttd  = $(this).attr('id');
        
            console.log("parenttd=" + parenttd);
            
        var self = $(this);
        //if you don't want "data" in placeholder more than one
        //self.find(".sortintodb").remove();
        var dropId = ui.draggable.find("div.parts").attr('id');
            console.log(dropId);
        var dropElement = ui.draggable.html();
        if (self.find("[id=" + dropId + "]").length) return;
            $(dropElement).appendTo(self) ;   
      }
  })
});
*/
/**************** Draggable and Dropable js End ****************************/
 //$scope.days = [];
  $scope.daysSections = function (daysCount) {
       
//        for (var i=1; i<=daysCount; i++) {
//            var days = i;
//        }
        $scope.daySections = daysCount;
        //$("table#droppable-table").addClass("droppable");
    };

//    console.log(sum)
  /**************** Start Draggable and Dropable Js ****************************/


/*$(function() {
    $(".fetchedfromdb li").draggable({
        containment: 'parent',
        helper: "clone",
        connectToSortable: '.sortable',
    });
    $(".sortintodb").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper)",
    drop: function(event, ui) {
        console.log(event);
        console.log(ui);
        var self = $(this);
        //if you don't want "data" in placeholder more than one
        //self.find(".sortintodb").remove();
        var dropId = ui.draggable.attr('id');
        if (self.find("[id=" + dropId + "]").length) return;
        $("<li></li>", {
            "text": ui.draggable.text(),
            "id": dropId
        }).appendTo(this);
    },
    });
    
    $('#trash').droppable({
        over: function(event, ui) {
            ui.draggable.remove();
        }
    });
    
    $('.sortintodb').sortable({
      placeholder: "ui-state-highlight",
    });

});*/

$scope.mealplan = {};
function readImage() {
    if ( this.files && this.files[0] ) {
        var FR = new FileReader();
        FR.onload = function(e) {
             $('#img').show();
             $('#img').attr( "src", e.target.result );
             $('#imageCode').val(e.target.result);
             $scope.mealplan.image = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

$("#fileInput").change(readImage);

    /*
     * Start set scope
     * @Scope: To use for save meal plan to meals tabel.
     * @param: id,isvaild
     * @returns: {mealPlanner}
     * @Author: Rohit.kumar
     */
    $scope.save_meal = function(is_valid) {
         
        // if (is_valid) {
             
             $scope.mealplan.daysplan = $scope.meal;
             
        toaster.clear();
            MealPlanCollection.save($scope.mealplan).$promise.then(function (res) {
                toaster.success(res.data);
                $state.go('admin.manage_meals');
                }, function (err) {
                toaster.error('Something Went Wrong');
            });
        
        //}
    }
    // End set scope  
   
    
    
 // End meal plan Controller   
});
