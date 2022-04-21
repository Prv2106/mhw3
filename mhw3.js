const num_results = 15;


// API con autenticazione OAuth2
const petfinder_api_endpoint_token = 'https://api.petfinder.com/v2/oauth2/token';
const petfinder_api_endpoint_animals = 'https://api.petfinder.com/v2/animals';
const petfinder_key = '3vMrtRTUZrp5qkMeeeOB7x3fnlF5iclgz5P1SXVBSaQd15OGWO';
const petfinder_client_secret = 'buczaYkujddghrgTK2Ujahxl1g1xF7XOczgHru5m';
const petfinder_api_endpoint_organization = 'https://api.petfinder.com/v2/organizations';
let petfinder_token;



function onJsonToken(json){
    petfinder_token= json.access_token;
}


function onPetAdoptionJson(json){
    console.log(json);
    const results = json.organizations;
    const text = document.querySelector('#pet_adoption');
    const list = document.querySelector('#petadoption-view');
    list.innerHTML = '';
  
    let caught=false;

    for(let result of results){

        if(
            (result.address.city !== text.value)||
            (result.photos.length === 0) ||
            (result.email === null) ||
            (result.website === null)
          ){
            continue;
        }

        caught = true;
        let box_contents = document.createElement('div');
        box_contents.classList.add('boxContents');
        let name = document.createElement('strong');
        let city = document.createElement('em');
        let email = document.createElement('a');
        email.classList.add('info');        
        name.textContent = result.name;
        city.textContent = 'city: ' + result.address.city;
        email.textContent = result.email;


        
        list.appendChild(box_contents);
        box_contents.appendChild(name);
        let img_box = document.createElement('div');
        img_box.classList.add('imgBox');
        let img = document.createElement('img');
        img.src = result.photos[0].medium;
        box_contents.appendChild(img_box);
        img_box.appendChild(img);

        
        
       
        box_contents.appendChild(city);
        let span_email = document.createElement('span');
        span_email.textContent = 'email: ';
        box_contents.appendChild(span_email);
        box_contents.appendChild(email);

    
        let website = document.createElement('a');
        website.classList.add('info');
        website.href = result.website;
        website.target = '_blank';
        let div_web = document.createElement('div');
        div_web.textContent = 'website:';
        website.textContent = result.website;
        box_contents.appendChild(div_web);
        box_contents.appendChild(website);
       
       
    }



    if(caught === false){
        let unfound = document.createElement('strong');
        list.appendChild(unfound);
        unfound.textContent = 'No organization found ';
        return;
    }

}


function onResponse(response){
    return response.json();
}



function petAdoptionRequest(event){
    event.preventDefault();

    const text = document.querySelector('#pet_adoption');
    const encodedText = encodeURIComponent(text.value);
    let petfinderRequest = petfinder_api_endpoint_organization + "?query=" + encodedText + '&limit=' +num_results;
    
    fetch(petfinderRequest,
            {
                headers:
                {
                    "Authorization": "Bearer "  + petfinder_token
                }
            }
        ).then(onResponse).then(onPetAdoptionJson);


}






const petfinder_form = document.querySelector('#petfinder');

petfinder_form.addEventListener('submit',petAdoptionRequest);








fetch(petfinder_api_endpoint_token,
    {
        method: 'POST',
        body: "grant_type=client_credentials&client_id=" + petfinder_key + "&client_secret=" + petfinder_client_secret,
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
).then(onResponse).then(onJsonToken);





// API Senza autenticazione

// API
const zoo_api_endpoint = 'https://zoo-animal-api.herokuapp.com/animals/rand/10/';

function onFactJson(json){
    console.log('json zoo api');
    console.log(json);

   
    const album = document.querySelector('#album-view');
    album.innerHTML='';

    for(let result of json){

        const container = document.createElement('div');
        container.classList.add('boxContents');
        const img_box = document.createElement('div');
        img_box.classList.add('imgBox');
        const img = document.createElement('img');
        img.src = result.image_link;

        let div_latin = document.createElement('div');
        div_latin.textContent = 'Nome latino:';
        let latin_name = document.createElement('strong');
        latin_name.textContent = result.latin_name;
        let div_geo = document.createElement('div');
        div_geo.textContent = 'Geolocalizzazione:'
        let geo_range = document.createElement('span');
        geo_range.textContent = result.geo_range;
        geo_range.classList.add('info');

        album.appendChild(container);
        container.appendChild(div_latin);
        container.appendChild(latin_name);
        container.appendChild(img_box);
        img_box.appendChild(img);
        container.appendChild(div_geo);
        container.appendChild(geo_range);

        
    }


    
}

function onFactResponse(response){
    return response.json();
}


function factRequest(event){
    fetch(zoo_api_endpoint).then(onFactResponse).then(onFactJson);
}



const fact_random_button= document.querySelector('#random');

fact_random_button.addEventListener('click',factRequest);
