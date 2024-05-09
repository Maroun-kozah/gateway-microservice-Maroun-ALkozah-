const express = require('express');

// Import necessary utilities and middleware
const authenticateFunctionMiddleware = require('../middleware/authenticate');
const globalRoutingFunction = require('../utils/requestHandler');
const config = require('../config/config'); // Ensure this is the correct path
const { Headers } = require('openai/_shims/index.mjs');

module.exports = function (app) {
  const allRouter = express.Router();

  const routes = [
    {
      api: "/api/v1/signup",
      microserviceUrl: `${config.microserviceUrls.idp}/user/signup`,
      microserviceName: "idp",
      methods: ["post"],
    },
    {
      api: "/api/v1/login",
      microserviceUrl: `${config.microserviceUrls.idp}/user/login`,
      microserviceName: "idp",
      methods: ["post"],
    },
    {
      api: "/api/v1/profile",
      microserviceUrl: `${config.microserviceUrls.idp}/user/profile`,
      microserviceName: "idp",
      methods: ["get"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/profile/edit",
      microserviceUrl: `${config.microserviceUrls.idp}/user/profile/edit`,
      microserviceName: "idp",
      methods: ["put"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/rate-video/:id",
      microserviceUrl: `${config.microserviceUrls.videoProvider
        }/ratings/add/:id`,
      microserviceName: "idp",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/all-videos",
      microserviceUrl: `${config.microserviceUrls.videoProvider}/videos/all`,
      microserviceName: "idp",
      methods: ["get"],
    },
    {
      api: "/api/v1/play-video/:id",
      microserviceUrl: `${config.microserviceUrls.videoProvider
        }/videos/play/:id`,
      microserviceName: "idp",
      methods: ["get"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/create-video",
      microserviceUrl: `${config.microserviceUrls.videoProvider}/videos/create`,
      microserviceName: "idp",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/comment/:id",
      microserviceUrl: `${config.microserviceUrls.videoProvider
        }/comments/create/:id`,
      microserviceName: "idp",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/reply/:id",
      microserviceUrl: `${config.microserviceUrls.videoProvider
        }/comments/reply/:id`,
      microserviceName: "idp",
      methods: ["post"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/update-comment/:id",
      microserviceUrl: `${config.microserviceUrls.videoProvider
        }/comments/update/:id`,
      microserviceName: "idp",
      methods: ["put"],
      isAuthenticated: true,
    },
    {
      api: "/api/v1/view-comments/:id",
      microserviceUrl: `${config.microserviceUrls.videoProvider
        }/comments/view/:id`,
      microserviceName: "idp",
      methods: ["get"],
      isAuthenticated: true,
    },
  ];

  routes.forEach((route) => {
    const routeHandler = allRouter.route(route.api);

    // Apply authentication middleware if the route is protected
    if (route.isAuthenticated) {
      allRouter.use(route.api, authenticateFunctionMiddleware());
    }

    // Handle each method specified in the route using a switch statement
    route.methods.forEach(method => {
      switch (method.toLowerCase()) {
        case 'get':
          routeHandler.get(globalRoutingFunction.bind(null, route));
          break;
        case 'post':
          routeHandler.post(globalRoutingFunction.bind(null, route));
          break;
        case 'delete':
          routeHandler.delete(globalRoutingFunction.bind(null, route));
          break;
        case 'put':
          routeHandler.put(globalRoutingFunction.bind(null, route));
          break;
        default:
          console.error(`Unsupported method ${method} for route ${route.api}`);
      }
    });
  });

  app.use('/api', allRouter);
  app.use(allRouter);
};
