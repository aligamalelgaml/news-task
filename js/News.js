export class NewsModel {
    constructor(key) {
        this.apiKey = key;
    }

    
    /** Async function that utilizes fetch API to get news of arbitary country (via country code arguement) throughs NewsAPI.com
     * @param {*} countryCode | the CCA2 country code
     * @param {*} handler | callback function to update news view.
     */
    async getNews(countryCode, handler) {
        var url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=3&apiKey=${this.apiKey}`;

        let response = await fetch(url);

        let data = await response.json(); // read response body and parse as JSON

        data.articles.forEach(article => {
            handler(article);
        });
    }
}

export class NewsView {
    constructor() {}

    /** Renders the news listing via mustache.js template.
     * @param {*} data | contains all news attributes (news title, description and attached image)
     */
    renderNews(data) {
        const template = $("#news-item-template").html();
        const rendered = Mustache.render(template, { title: data.title, description: data.description, image: data.urlToImage});
        $("#news-target").append(rendered);
    }
    
    /**
     * Clears the news listing.
     */
    clearNews() {
        $(".news-item").remove();
    }
}

export class NewsController {
    constructor(model, view, mediator) {
        this.model = model;
        this.view = view;
        this.mediator = mediator;

        this.mediator.subscribe(this.retreiveNews); // Subscribes the retreiveNews function to the mediator.

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