function OverlayPlot(ui, building) {
    OverlayPlot.superclass.constructor.call(this);
    this.ui = ui;
    this.building = building;
}

OverlayPlot.inherit(Object, {
    createUi: function() {
        var _this = this;
        var parentWindow = $(".overlayList");
        var parent = $(".overlayList .content");
        var actors = this.ui.game.player.henchmen;
        var list = $("<div class='list'></div>");
        
        parent.empty();
        
        $.each(actors, function() {
            var actor = this;
            var li = $("<label></label>");
            li.append("<input type='checkbox'>");
            li.append("<img class='portrait' height='16px' src='"+ this.portrait +"'/>");
            li.append("<span class='fullName'>"+ this.getFullName() +"</span>");
            li.data("actor", actor);            
            list.append(li);
        });
        
        parent.append(list);
        
        var actionBox = document.createElement("select");
        actionBox.size = 1;
        actionBox.innerHTML = "<option value='harassVisitors'>Harass visitors</option>" +
            "<option value='harassWorkers'>Harass workers</option>" +
            "<option value='claimProtectionMoney'>Claim protection money</option>";
        
        parent.append(actionBox);
        parent.append("<br/>");
        
        var orderButton = $("<input type='button' value='Order'></input>");
        
        orderButton.click(function() {
            list.children().each(function() {
                // lazy assumption that the checkbox is element 0
                if (this.children[0].checked) {
                    var actor = $(this).data("actor");
                    Orders.command(
                        actionBox.value,
                        actor,
                        _this.building.node
                    );
                }
            });
            _this.destroy();
        });
        
        parent.append(orderButton);
        
        parentWindow.show("slow");
    },
    
    destroy: function() {
        $(".overlayList").hide("slow");
        $(".overlayList .content").empty();
    }
});
