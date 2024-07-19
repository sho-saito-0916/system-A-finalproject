var vendingMachines = []; // 自動販売機の情報を保持する配列
var markers = []; // 地図上のマーカーを保持する配列

async function initMap() {
    var MyLatLng = { lat: 35.6811673, lng: 139.7670516 };
    var mapOptions = {
        zoom: 15,
        center: MyLatLng,
        mapTypeId: 'roadmap'
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // マップをクリックした時のイベントリスナー
    map.addListener('click', function(event) {
        document.getElementById('lat').value = event.latLng.lat();
        document.getElementById('lng').value = event.latLng.lng();
    });

    // 自動販売機の情報を配列からマップにマーカーとして追加
    function addMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
        vendingMachines.forEach(function(machine) {
            var marker = new google.maps.Marker({
                position: { lat: machine.lat, lng: machine.lng },
                map: map,
                title: machine.name
            });

            // マーカーのクリックイベント
            marker.addListener('click', function() {
                let drinkList = '自動販売機: ' + machine.name + '\n';
                machine.drinks.forEach(drink => {
                    drinkList += drink.name + ': ' + drink.price + '円\n';
                });
                alert(drinkList);
            });

            markers.push(marker);
        });
    }

    addMarkers();

    document.getElementById('addDrink').addEventListener('click', function() {
        const drinkContainer = document.createElement('div');
        drinkContainer.classList.add('drink');
        drinkContainer.innerHTML = `
            <label>飲み物の名前</label>
            <input type="text" class="drinkName">
            <label>価格</label>
            <input type="text" class="drinkPrice">
            <span class="removeDrink" onclick="removeDrink(this)">×</span>
        `;
        document.getElementById('drinksContainer').appendChild(drinkContainer);
    });

    document.getElementById('saveMachine').addEventListener('click', function() {
        const machineName = document.getElementById('machineName').value;
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        const drinks = [];

        document.querySelectorAll('.drink').forEach(drinkDiv => {
            const name = drinkDiv.querySelector('.drinkName').value;
            const price = parseFloat(drinkDiv.querySelector('.drinkPrice').value);

            // 入力が空欄でない飲み物のみ追加
            if (name && !isNaN(price)) {
                drinks.push({ name, price });
            }
        });

        if (drinks.length === 0) {
            alert('飲み物の情報がありません。');
            return;
        }

        const newMachine = { name: machineName, lat, lng, drinks };

        // 自動販売機の情報を配列に追加
        vendingMachines.push(newMachine);

        // 自動販売機の情報を地図上にマーカーとして追加
        addMarkers();

        alert('自動販売機の情報が保存されました。');
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        const searchName = document.getElementById('searchDrinkName').value.toLowerCase();
        markers.forEach(marker => marker.setMap(null));
        markers = [];
        vendingMachines.forEach(function(machine) {
            const found = machine.drinks.some(drink => drink.name.toLowerCase() === searchName);
            if (found) {
                var marker = new google.maps.Marker({
                    position: { lat: machine.lat, lng: machine.lng },
                    map: map,
                    title: machine.name
                });

                // マーカーのクリックイベント
                marker.addListener('click', function() {
                    let drinkList = '自動販売機: ' + machine.name + '\n';
                    machine.drinks.forEach(drink => {
                        drinkList += drink.name + ': ' + drink.price + '円\n';
                    });
                    alert(drinkList);
                });

                markers.push(marker);
            }
        });
    });
}

function removeDrink(element) {
    var drinkDiv = element.parentElement;
    drinkDiv.remove();
}

window.onload = initMap;
