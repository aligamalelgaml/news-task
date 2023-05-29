import Mediator from './Mediator.js';
import { CarouselModel, CarouselView, CarouselController } from './Carousel.js';
import { NewsModel, NewsView, NewsController } from './News.js';


$(document).ready(function() {
    const mediator = new Mediator();
    const carousel = new CarouselController(new CarouselModel(), new CarouselView(), mediator);
    const news = new NewsController(new NewsModel("5ab4c464d7d949cb91e46dab12ef90b4"), new NewsView(), mediator);
});
  





