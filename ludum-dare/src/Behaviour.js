function Behaviour(actor) {
    this.actor = actor;
}

Behaviour.inherit(Object, {
    findNewAction: function() {
        
    },
    
    defaultActions: function() {
        var _this = this;
        
        // sleep
        if (this.actor.wakefulness < 20) {
            var sleepRequired = 100 - this.actor.wakefulness;
            this.actor.findPath(this.actor.home.node);
            this.actor.addActionToPath({
                name: "sleep",
                duration: sleepRequired/2,
                wakefulness:sleepRequired
            })
            return true;
        // buy new food
        } else if (this.actor.household.requiresResourceAddition()) {
            // carries more stuff from the store if awake
            this.actor.household.plannedResourceAddition = (this.actor.household.maxResources -
                                                            this.actor.household.resources) *
                                                            (100-this.actor.wakefulness);
            this.actor.findPathToBuildingType("smallStore");
            this.actor.addActionToPath({
                name: "shopping",
                duration: randomInRange(5, 15),
                onEnd: function() {
                    _this.actor.findPath(_this.actor.home.node);
                    _this.actor.addActionToPath({
                        name: "refillResources",
                        duration: 5,
                        onEnd: function() {
                            _this.actor.household.refillResources();
                        }
                    });
                }
            });
            console.log("go shopping");
            return true;
        // eat
        } else if (this.actor.home.node == this.actor.node && this.actor.satiety < 50) {
            var resourcesEaten = Math.min(100-this.actor.satiety, this.actor.household.resources)
            this.actor.household.resources -= resourcesEaten;
            this.actor.addActionToPath({
                name:"eat",
                satiety:resourcesEaten,
                duration: resourcesEaten/5
            });
            return true;
        }
        
        return false;
    },
    
    reset: function() {
    
    }
});


function ThugBehaviour(actor) {
    ThugBehaviour.superclass.constructor.call(this, actor);
    this.lurkTargets = ["smallStore", "library", "park", "random"];
}

ThugBehaviour.inherit(Behaviour, {
    findNewAction: function() {
        if (this.defaultActions()) {
            return;
        }
    
        var _this = this;
        
        var lurkTargets = this.lurkTargets.slice();
        for (var i=0; i < lurkTargets; ++i) {
            if (lurkTargets[i] == this.lastAction) {
                lurkTargets.splice(i,1);
                break;
            }
        }
        var targetBuildingType = randomElementInArray(lurkTargets);
        
        if (targetBuildingType == "random") {
            this.actor.findPath(randomElementInArray(this.actor.map.nodes));
            this.lastAction = targetBuildingType;
        } else if (targetBuildingType && this.actor.map) {
            var building = this.actor.map.findBuildingOfType(targetBuildingType);
            if (building) {
                this.actor.findPath(building.node);
                this.lastAction = targetBuildingType;
            }
        }
        
        
        // that's all thugs do
        this.actor.addActionToPath({
            name:"lookForVictims", 
            duration:randomInRange(30, 52),
            onOtherArrived: function(other) {
                if (this.isInSameHousehold(other) || other.role == "thug" || other.role == "police") {
                    console.log(this.getFullName() + " does not harass " + other.getFullName());
                    return; // thugs don't steal from thugs, family or police
                }
                
                // i'd just like to interject for a moment
                this.interjectAction({
                    name:"harass",
                    duration: 5
                });
                other.insertAction({
                    name:"gettingHarassed",
                    duration: 5,
                    onEnd: function() {
                        var harressedMoney = 5;
                        this.transfereMoney(_this.actor, harressedMoney);
                    }
                });
            }
        });
    }
});

function WorkerBehaviour(actor) {
    WorkerBehaviour.superclass.constructor.call(this, actor);
}

WorkerBehaviour.inherit(Behaviour, {
    findNewAction: function() {
        if (this.defaultActions()) {
            return;
        }
        
        if (this.actor.job) {
            this.actor.findPath(this.actor.job.node);
            this.actor.addActionToPath({
                name:"work",
                duration:this.actor.job.worktime,
                wakefulness: -(this.actor.job.worktime*2)
            });
        }
    }
});

function NeetBehaviour(actor) {
    NeetBehaviour.superclass.constructor.call(this, actor);
    this.lastAction = "";
    this.lurkTargets = ["smallStore", "library", "park"];
}

NeetBehaviour.inherit(Behaviour, {
    findNewAction: function() {
        if (this.defaultActions()) {
            return;
        }
        
        var lurkTargets = this.lurkTargets.slice();
        for (var i=0; i < lurkTargets; ++i) {
            if (lurkTargets[i] == this.lastAction) {
                lurkTargets.splice(i,1);
                break;
            }
        }
        var targetBuildingType = randomElementInArray(lurkTargets);
        
        if (targetBuildingType && this.actor.map) {
            var building = this.actor.map.findBuildingOfType(targetBuildingType);
            if (building) {
                this.actor.findPath(building.node);
                this.lastAction = targetBuildingType;
            }
        }
        // that's all NEETs do
        this.actor.addActionToPath({name:"relax", duration:randomInRange(7, 32)});
    }
});

function PoliceBehaviour(actor) {
    PoliceBehaviour.superclass.constructor.call(this, actor);
}

PoliceBehaviour.inherit(Behaviour, {
    findNewAction: function() {
        
    }
});