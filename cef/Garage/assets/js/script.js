$type = 1;
        $typeName = "Fahrzeuge";

        $vehicle = null;
        $types = null;
        $garageId = null;

        function selectType(type, typeName) {
            $("#select-"+$type).removeClass("active");
            $("#vehicles-"+$type).fadeOut("fast");
            
            $type = type;
            $typeName = typeName;

            $("#typetitle").text(typeName);
            $("#select-"+$type).addClass("active");
            $("#vehicles-"+$type).css("display","grid");

            document.getElementById('submit').disabled = true;
            if ($vehicle != null) {
                document.getElementById($vehicle).classList.remove("active");
                $vehicle = null;
            }
        }

        function fillInformations(garageId, json) {
            var bikeHTML = "",
                carHTML = "";
            json = JSON.parse(json);
            $garageId = garageId;

            for (var i in json) {
                if (json[i].type == "bike") {
                    bikeHTML += '<div id="'+json[i].displayName+'" onclick="selectVehicle(\''+json[i].displayName+'\', 1);" class="item"><div class="icon"><i class="fas fa-motorcycle"></i></i></div><div class="description"><h3>'+json[i].displayName+'</h3><p>Level '+json[i].neededLevel+'</p></div></div>';
                } else if (json[i].type == "car") {
                    carHTML += '<div id="'+json[i].displayName+'" onclick="selectVehicle(\''+json[i].displayName+'\', 1);" class="item"><div class="icon"><i class="fas fa-car"></i></div><div class="description"><h3>'+json[i].displayName+'</h3><p>Level '+json[i].neededLevel+'</p></div></div>';
                }
            }

            $("#vehicles-1").html(bikeHTML);
            $("#vehicles-2").html(carHTML);
        }

        function setPrivateCars(json) {
            var html = "";
            json = JSON.parse(json);

            for (var i in json) {
                html += '<div id="'+json[i].displayName+'" onclick="selectVehicle(\''+json[i].displayName+'\', 2);" class="item"><div class="icon"><i class="fas fa-car"></i></div><div class="description"><h3>'+json[i].displayName+'</h3><p>Level '+json[i].neededLevel+'</p></div></div>';
            }

            $("#vehicles-3").html(html);
        }

        function setPrestigeCars(json) {
            var html = "";
            json = JSON.parse(json);

            for (var i in json) {
                html += '<div id="'+json[i].displayName+'" onclick="selectVehicle(\''+json[i].displayName+'\', 3);" class="item"><div class="icon"><i class="fas fa-car"></i></div><div class="description"><h3>'+json[i].displayName+'</h3><p>Level '+json[i].neededLevel+'</p></div></div>';
            }

            $("#vehicles-4").html(html);
        }

        function setFraktionCars(json) {
            var html = "";
            json = JSON.parse(json);

            for (var i in json) {
                html += '<div id="'+json[i].displayName+'" onclick="selectVehicle(\''+json[i].displayName+'\', 4);" class="item"><div class="icon"><i class="fas fa-car"></i></div><div class="description"><h3>'+json[i].displayName+'</h3><p>Level '+json[i].neededLevel+'</p></div></div>';
            }

            $("#vehicles-5").html(html);
        }


        function selectVehicle(displayName, typs) {
            if ($vehicle != null) {
                $("#"+$vehicle).removeClass("active");
            }

            $vehicle = displayName;
            $types = typs;
            $("#"+$vehicle).addClass("active");
            document.getElementById('submit').disabled = false;
        }

        function dismiss() {
            mp.trigger("Client:Garage:destroyBrowser");
        }

        function dispatch() {
            if ($vehicle != null && $types != null && $garageId != null) {
                mp.trigger('Client:Garage:takeVehicle', $vehicle, $types, $garageId);
            }
        }