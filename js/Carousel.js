export class CarouselModel {

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

    /** Async function that retreives all info for countries with a CCA2 code in `this.flags` and inserts it into `this.info`.
     * @returns | Fulfilled promises.
     */
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

export class CarouselView {

    /** Renders the carousel with all accompanying flag images & data.
     * @param {*} flags | all country CCA2 codes.
     * @param {*} info | all country information.
     */
    renderCarousel(flags, info) {
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

    /** Binds carousel image clicking to controller.
     * @param {*} handler | callback function to controller's flagClickHandler
     */
    bindCheckInfoEvent(handler) {
        $('.carousel').on('click', 'img', function(e) {

            let currentFlag = $(this).attr("data-country-code");
            handler(currentFlag);
        });

    }

}

export class CarouselController {
    constructor(model, view, mediator) {
        this.model = model;
        this.view = view;
        this.mediator = mediator;

        this.initialRender(); 

        this.view.bindCheckInfoEvent(this.flagClickHandler); // Binding function.
    }

    initialRender() {
        this.model.retreiveInfo() // Wait for all info to be retreived **then** render carousel images.
          .then(() => {
            this.view.renderCarousel(this.model.getFlags(), this.model.getInfo());
          });
      }
      

    flagClickHandler = (flag) => {
        this.mediator.notify(flag); // Notifies all subscribers to the mediator that a click event has occured with the correct flag passed on.
    }

}