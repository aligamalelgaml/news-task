// import Mediator from "./Mediator.js";


class CarouselModel {

    constructor() {
        this.flags = ["us", "gb", "ca", "eg"]; // All flags are saved as CCA2 codes in an array.
        this.info = {};

        this.retreiveInfo();
    }

    getFlags() {
        return this.flags;
    }

    getInfo() {
        return this.info;
    }

    retreiveInfo() {
        const fetchPromises = this.flags.map(flag => {
          return fetch(`https://restcountries.com/v3.1/alpha/${flag}`)
            .then(response => response.json())
            .then(countryInfo => {
              this.info[flag] = countryInfo;
            })
            .catch(error => {
              console.error(`Error fetching country info for ${flag}:`, error);
            });
        });
      
        return Promise.all(fetchPromises);
      }
      
      

}

class CarouselView {
    renderCarousel(flags, info) {

        console.log(info);


        const template = $("#carousel-item-template").html();

        flags.forEach((flag, index) => {
            const country = info[flag][0];
            const capital = country.capital[0],
                  population = country.population,
                  area = country.area,
                  offName = country.name.official;

            let rendered;

            if(index === 0) {
                rendered = Mustache.render(template, { countryCode: flag, active: 'active', name: offName, capital: capital, pop: population, area: area });

            } else {
                rendered = Mustache.render(template, { countryCode: flag, active: '', name: offName, capital: capital, pop: population, area: area  });
            }

            $("#carousel-target").append(rendered);
        });

    }

    bindCheckInfoEvent(handler) {
        $('.carousel').on('click', 'img', function(e) {

            let currentFlag = $(this).attr("data-country-code");
            handler(currentFlag);
        });

    }

}

class CarouselController {
    constructor(model, view, mediator) {
        this.model = model;
        this.view = view;
        this.mediator = mediator;

        this.initialRender(); 


        this.view.bindCheckInfoEvent(this.flagClickHandler);
    }

    initialRender() {
        this.model.retreiveInfo()
          .then(() => {
            this.view.renderCarousel(this.model.getFlags(), this.model.getInfo());
          });
      }
      

    flagClickHandler = (flag) => {
        console.log(flag + " is selected"); //notify here
        this.mediator.notify(flag);
    }

}


// ==== START OF NEWS MODULE ==== //

class NewsModel {
    constructor(key) {
        this.apiKey = key;
    }

    async getNews(countryCode, handler) {
        var url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=3&apiKey=${this.apiKey}`;

        let response = await fetch(url);

        let data = await response.json(); // read response body and parse as JSON

        data.articles.forEach(article => {
            handler(article);
        });
    }
}

class NewsView {
    constructor() {}

    renderNews(data) {
        const template = $("#news-item-template").html();
        const rendered = Mustache.render(template, { title: data.title, description: data.description, image: data.urlToImage});
        $("#news-target").append(rendered);
    }

    clearNews() {
        $(".news-item").remove();
    }
}

class NewsController {
    constructor(model, view, mediator) {
        this.model = model;
        this.view = view;
        this.mediator = mediator;

        this.mediator.subscribe(this.retreiveNews);

        this.initialRender();
    }

    initialRender() {
        this.model.getNews("us", this.view.renderNews);
    }

    retreiveNews = (country) => {
        this.view.clearNews();
        this.model.getNews(country, this.view.renderNews);
    }
}


// ==== START OF MEDIATOR MODULE ==== //

class Mediator {
    constructor() {
        this.observers = [];
    }
   
    subscribe(func) {
        this.observers.push(func);
    }
   
    unsubscribe(func) {
        this.observers = this.observers.filter((observer) => observer !== func);
    }
   
    notify(data) {
        this.observers.forEach((observer) => observer(data));
    }
}


$(document).ready(function() {
    const mediator = new Mediator();
    const carousel = new CarouselController(new CarouselModel(), new CarouselView(), mediator);
    const news = new NewsController(new NewsModel("5ab4c464d7d949cb91e46dab12ef90b4"), new NewsView, mediator);
});
  





