class CarouselModel {
    constructor() {
        this.flags = ["us", "gb", "ca", "eg"];
    }

    getFlags() {
        return this.flags;
    }

}

class CarouselView {
    renderCarousel(flags) {

        const template = $("#carousel-item-template").html();

        flags.forEach((flag, index) => {
            let rendered;

            if(index === 0) {
                rendered = Mustache.render(template, { countryCode: flag, active: 'active' });

            } else {
                rendered = Mustache.render(template, { countryCode: flag, active: '' });
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
    constructor(model, view){
        this.model = model;
        this.view = view;

        this.initialRender();

        this.view.bindCheckInfoEvent(this.flagClickHandler);
    }

    initialRender() {
        this.view.renderCarousel(this.model.getFlags())
    }

    flagClickHandler = (flag) => {
        console.log(flag + "is selected");
    }

}

const carousel = new CarouselController(new CarouselModel(), new CarouselView());

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
            console.log(article);
            handler(article);
        });
      }
}

class NewsView {
    constructor() {}

    renderNews(data) {
        const template = $("#news-item-template").html();
        const rendered = Mustache.render(template, { title: data.title, description: data.description });
        $("#news-target").append(rendered);

    }
}

class NewsController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initialRender();
    }

    initialRender() {
        this.model.getNews("us", this.view.renderNews);
    }
}

const news = new NewsController(new NewsModel("5ab4c464d7d949cb91e46dab12ef90b4"), new NewsView);

