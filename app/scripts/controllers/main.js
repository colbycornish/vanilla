'use strict';

/**
 * @ngdoc function
 * @name Volusion.controllers.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the volusionMethodThemeApp
 */
angular.module('Volusion.controllers')
	.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'vnApi', 'Cart',
		function ($scope, $rootScope, $location, $window, $timeout, vnApi, Cart) {

			//hide header & footer when viewing theme-settings
			if ($location.path().indexOf('/theme-settings') >= 0) {
				$rootScope.hideWrapper = true;
			}

			// TODO: Consider moving SEO into a service
			$rootScope.seo = {};

			// TODO: refactor the seo state into a directive.
			//$scope.$on('$stateChangeSuccess', function(event, toState) {
			//	if (toState.name === 'i18n') {
			//		$state.go('.home', null, { location: 'replace' });
			//	} else if (toState.name === 'i18n.home' && $scope.config) {
			//		$rootScope.seo = angular.extend($rootScope.seo, $scope.config.seo);
			//	}
			//});

			$scope.isPrimaryNavReady = false;

			function buildSmartNav(cssClassForTopLevelMenuItems) {
				var itemIndex = 0,
					firstItemTopPosition = 0,
					indexPositionWhereItemWrapped = 0,
					newSmartNavCategories = [];

				angular.forEach(angular.element('.' + cssClassForTopLevelMenuItems), function (value) {
					// Get top position of first item
					if (itemIndex === 0) {
						firstItemTopPosition = angular.element(value).position().top;
					}

					if (angular.element(value).position().top !== firstItemTopPosition) {
						indexPositionWhereItemWrapped = itemIndex;
						return false;
					}

					itemIndex++;
				});

				if (indexPositionWhereItemWrapped !== 0) {
					$scope.displaySmartNavMoreMenuItem = true;
					$scope.smartNavMoreCategories = [];

					angular.forEach($scope.categories, function (value, index) {
						if (index >= (indexPositionWhereItemWrapped - 1)) {
							$scope.smartNavMoreCategories.push(value);
						} else {
							newSmartNavCategories.push(value);
						}
					});

					$scope.smartNavCategories = newSmartNavCategories;
				}

				angular.element('.' + cssClassForTopLevelMenuItems).css('visibility', 'visible');
			}

			$rootScope.windowWidth = $window.outerWidth;
			angular.element($window).bind('resize', function () {
				$rootScope.windowWidth = $window.outerWidth;
				$rootScope.$apply('windowWidth');
			});

			$rootScope.$watch('windowWidth', function () {
				$scope.displaySmartNavMoreMenuItem = false;
				angular.element('.nav-top-level-menu-items').css('visibility', 'hidden');

				$scope.smartNavCategories = $scope.categories;

				$timeout(function () {
					buildSmartNav('nav-top-level-menu-items');
				}, 0);
			});

			// Handle Navigation
			vnApi.Nav().get({ navId: 1 }).$promise
				.then(function (response) {
					$scope.smartNavCategories = $scope.categories = response.data;

					$timeout(function () {
						buildSmartNav('nav-top-level-menu-items');
					}, 0);

				}, function (error) {
					console.log('Error: ' + error);
				});

			// Handle the setup data
			$scope.config = vnApi.Configuration().get();

			$scope.cart = vnApi.Cart().get();

			//this.getConfig(this.getCart);  //TODO Prune this code
			//
			// TODO add function for ng-click that does this.
			//$rootScope.viewCart = function() {
			//	if ($rootScope.isInDesktopMode) {
			//		return '/shoppingcart.asp';
			//	} else {
			//		return '/checkout.asp';
			//	}
			//};

			$rootScope.$on('VN_ADD_TO_CART', function (event, cartItem) {
				$rootScope.$emit('VN_ADD_TO_CART_BEFORE', cartItem);
				var status = 'error';
				Cart.saveCart(cartItem)
					.then(function (response) {
						status = 'success';
						$rootScope.$emit('VN_ADD_TO_CART_SUCCESS', {
							status      : status,
							originalData: cartItem,
							data        : response.data
						});
					}, function () {
						$rootScope.$emit('VN_ADD_TO_CART_FAIL', {
							status: status,
							data  : cartItem
						});
					})
					.finally(function (response) {
						$rootScope.$emit('VN_ADD_TO_CART_COMPLETE', {
							status      : status,
							originalData: cartItem,
							data        : response.data
						});
					});
			});

			$scope.searchLocal = '';

			$scope.doSearch = function () {
//				console.log('Searching for: ' + $scope.searchLocal);
			};

			$scope.doScrollTop = function () {
				console.log('scroll to top');
//				TODO: Figure out how to scroll
//				$window.scrollTo(0,0);
//				$timeout(function () {
//					$('html,body').animate({
//						scrollTop: '0px'
//					}, 500);
//				}, 250);
			};

		}]);
