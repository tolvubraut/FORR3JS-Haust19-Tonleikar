let main = document.getElementById("results");
let url = "https://apis.is/concerts";
let dates = document.getElementById('date');
let search = document.getElementById('search');

let tonleika = [];

fetch(url)
    .then(function(results) {
        return results.json();
    })
    .then(function(results) {//Setja allt úr json í array
        let concerts = [...results.results];

        return concerts.map(function(concert) {//Búa til elements
            let div = document.createElement("div"),
                img = document.createElement("img"),
                pName = document.createElement("p"),
                pDate = document.createElement("p"),
                pPlace = document.createElement("p");
            div.dataset.eventDateName = concert.eventDateName.toLowerCase();
            img.src = concert.imageSource
            let date = concert.dateOfShow;
            let dateArray = date.split("T");
            let islDateArray = dateArray[0].split("-");
            let islclockArray = dateArray[1].split(":");
            div.dataset.Date = dateArray[0];

            function islDate(year, month, day) {//Tekur inn ár, mánuð og dag og breytir í íslenskt format 
                return day +"." + month + "." + year;
            }
            function clock(hours, minutes) {//Breyta formatið á tímanum í klst:min
                return hours + ":" + minutes;
            }

            pName.innerHTML = concert.eventDateName;
            pDate.innerHTML = islDate(islDateArray[0],islDateArray[1],islDateArray[2]) + " Kl: " + clock(islclockArray[0], islclockArray[1]);
            pPlace.innerHTML = concert.eventHallName;
            div.appendChild(img);
            div.appendChild(pName);
            div.appendChild(pDate);
            div.appendChild(pPlace);
            main.appendChild(div);
            tonleika.push(div);//Setur div elementinn inn í tonleika array
            search.addEventListener('keyup', searchDisplay);//Keyrir searchDisplay fallið þegar að það er lift takka þegar verið er að skrifa í search barinn 
            
            function searchDisplay() {//Finnur hvort að hvort að searchið passar ekki í eitthvað nafn
                if(!div.dataset.eventDateName.includes((this.value).toLowerCase())) {
                        div.classList = 'hide';//Setur hide classið á elementið það ef það passar ekki 
                }
                else {
                    div.classList.remove('hide');//Annars tekur fallið hide af
                }
            }

            function dateFormat(date) {//Function sem lagar formatið á dateinu sem er gefið af flatpickr.
                let dateSplit = date.split('/');
                if (dateSplit[0].length < 2 && dateSplit[1].length < 2){//Breytir úr d/m/yy yfir í yy-mm-dd
                    return dateSplit[2]+"-0"+dateSplit[1]+"-0"+dateSplit[0];
                }
                else if (dateSplit[0].length < 2) {
                    return dateSplit[2]+"-"+dateSplit[1]+"-0"+dateSplit[0];
                }
                else if (dateSplit[1].length < 2) {
                    return dateSplit[2]+"-0"+dateSplit[1]+"-"+dateSplit[0];
                }
                else {
                    return dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0];
                }
            }

            flatpickr(dates, {//Býr til dagatal
                locale: "is",
                mode: "range",
                altInput: true,
                altFormat: "d.m.y",
                onChange(selectedDates) {
                    let dateAfter = selectedDates[0];
                    let dateBefore = selectedDates[1];
                    dateDisplay(dateAfter, dateBefore);//Kallar í fallið dateDisplay með fyrri og seinni tímanum á dagatalinu
                }
        });

            function dateDisplay(after, before) {
                let afterArray = (after.getDate() +"/"+ (after.getMonth() +1) +"/"+ after.getFullYear());
                let beforeArray = (before.getDate() +"/"+ (before.getMonth() + 1) +"/"+ before.getFullYear());
                tonleika.forEach(concert => {//Fer í gegnum hvert div element í tonleika array
                    if(((concert.dataset.Date >= dateFormat(afterArray)) && (concert.dataset.Date <= dateFormat(beforeArray))) || (dateFormat(afterArray) === undefined && dateFormat(beforeArray) === undefined)) {
                        concert.classList.remove('hide');//Finnur hvaða element er utan tímabilinu sem notandi valdi og felur það.
                    }
                    else {
                        concert.classList = 'hide';
                    }
                });
            }
        });  
    })