'use strict';

(function () {
    function init() {
        var router = new Router([
            new Route('home', 'home.html', true),            
            new Route('accessory_page_list', 'accessory_page_list.html'),
            new Route('favorites_page', 'favorites_page.html'),
            new Route('item_page', 'item_page.html'),
            new Route('login_step_two', 'login_step_two.html'),
            new Route('login', 'login.html'),
            new Route('register', 'register.html'),
            new Route('user_cart', 'user_cart.html'),
            new Route('user_page', 'user_page.html'),
            new Route('page_not_found', 'page_not_found.html'),
        ]);
    }
    init();
}());
