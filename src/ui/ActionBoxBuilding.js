function ActionBoxBuilding(building, ui) {
    this.building = building
    this.ui = ui;
}

ActionBoxBuilding.inherit(Object, {
    createUi: function() {
        var _this = this;
        var enterButton = $("<input value='look inside' type='button'></input>");
        
        enterButton.click(function() {
            if (_this.ui.game.map != _this.building.interiorMap) {
                _this.ui.game.camera.jumpToMap(_this.building.interiorMap);
            }
        });
        
        $(".actionBox").empty();
        $(".actionBox").append($("<span>"+ this.building.getFullName() +"</span>"));
        $(".actionBox").append($("<br/>"));
        
        if (this.building.interiorMap) {
            $(".actionBox").append(enterButton);
            $(".actionBox").append($("<br/>"));
        }
        
        
        var moreButton = $("<input value='More...' type='button'></input>");
        moreButton.click(function() { 
            var o = new OverlayPlot(_this.ui, _this.building);
            o.createUi();
        });
        
        $(".actionBox").append(moreButton);
        // TODO charge prot money, add $ icon to regularly charged buildings
        // TODO show statistics, workers, inhabitants
        // TODO plot heist / harassment menu
    },
    
    destroy: function() {
        //FIXME
        this.ui.game.camera.removeObserver();
    
    }
});
