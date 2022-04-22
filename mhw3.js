const num_results = 15;

// API con autenticazione OAuth2
const petfinder_api_endpoint_token = 'https://api.petfinder.com/v2/oauth2/token';
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
        list.appendChild(box_contents);

        let name = document.createElement('strong');
        name.textContent = result.name;
        box_contents.appendChild(name);

        let img_box = document.createElement('div');
        img_box.classList.add('imgBox');
        let img = document.createElement('img');
        img.src = result.photos[0].medium;
        box_contents.appendChild(img_box);
        img_box.appendChild(img);



        let city = document.createElement('em');
        city.textContent = 'city: ' + result.address.city;
        box_contents.appendChild(city);

        let p_email = document.createElement('p');
        box_contents.appendChild(p_email);
        p_email.textContent = 'email: ';
        let email = document.createElement('a');
        email.classList.add('info');     
        email.textContent = result.email;
        email.href = 'mailto:' + result.email;
        p_email.appendChild(email);    
        
        let p_website = document.createElement('p');
        box_contents.appendChild(p_website);
        let website = document.createElement('a');
        website.classList.add('info');
        website.href = result.website;
        website.target = '_blank';
        website.textContent = result.website;
        p_website.textContent = 'website: ';
        p_website.appendChild(website);
       
    }



    if(caught === false){
        let unfound = document.createElement('strong');
        unfound.classList.add('not-found');
        list.appendChild(unfound); 
        unfound.textContent = 'No organization found in ' + text.value;
    }

}


function onResponse(response){
    return response.json();
}



function petAdoptionRequest(event){

    event.preventDefault();
    const text = document.querySelector('#pet_adoption');
    const encoded_text = encodeURIComponent(text.value);
    let petfinderRequest = petfinder_api_endpoint_organization + "?query=" + encoded_text + '&limit=' + num_results;
    
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




// API senza api_key
const zoo_api_endpoint = 'https://zoo-animal-api.herokuapp.com/animals/rand/7/';

function onZooJson(json){

    console.log(json);

    const album = document.querySelector('#album-view');
    album.innerHTML='';

    for(let result of json){

        const box_contents = document.createElement('div');
        box_contents.classList.add('boxContents');
        album.appendChild(box_contents);


        let div_latin = document.createElement('div');
        div_latin.textContent = 'Nome latino:';
        let latin_name = document.createElement('strong');
        latin_name.textContent = result.latin_name;
        box_contents.appendChild(div_latin);
        box_contents.appendChild(latin_name);


        const img_box = document.createElement('div');
        img_box.classList.add('imgBox');
        box_contents.appendChild(img_box);

        const img = document.createElement('img');
        img.src = result.image_link;
        img_box.appendChild(img);

        
        
        let div_geo = document.createElement('div');
        div_geo.textContent = 'Geolocalizzazione:'
        let geo_range = document.createElement('span');
        geo_range.textContent = result.geo_range;
        geo_range.classList.add('info'); 
        box_contents.appendChild(div_geo);
        box_contents.appendChild(geo_range);

     
        let div_type = document.createElement('div');
        div_type.textContent = 'tipo animale:';
        let type = document.createElement('div');
        type.textContent = result.animal_type;
        type.classList.add('info');
        box_contents.appendChild(div_type);
        box_contents.appendChild(type);

        
        
        let div_length = document.createElement('div');
        div_length.textContent = 'lunghezza:';
        let length = document.createElement('div');
        length.textContent = result.length_min + '-' + result.length_max + ' piedi';
        length.classList.add('info');
        box_contents.appendChild(div_length);
        box_contents.appendChild(length);

        let div_weight = document.createElement('div');
        div_weight.textContent = 'peso:';
        let weight = document.createElement('div');
        weight.textContent = result.weight_min + '-' + result.weight_max + ' libbre';
        weight.classList.add('info');
        box_contents.appendChild(div_weight);
        box_contents.appendChild(weight);

        


        
        


    }
    
}




function zooRequest(){
    fetch(zoo_api_endpoint).then(onResponse).then(onZooJson);
}

const zoo_random_button= document.querySelector('#random');
zoo_random_button.addEventListener('click',zooRequest);