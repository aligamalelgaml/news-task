// class Mediator {
//     constructor(carouselController, newsController) {
//         this.observers = [];

//         this.newsController = newsController;
//         this.carouselController = carouselController;

//         this.subscribe(this.newsController.rere)
//     }
   
//     subscribe(func) {
//       this.observers.push(func);
//     }
   
//     unsubscribe(func) {
//       this.observers = this.observers.filter((observer) => observer !== func);
//     }
   
//     notify(data) {
//       this.observers.forEach((observer) => observer(data));
//     }
// }

// export default Mediator;