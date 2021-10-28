const { receiveFields } = require("./boardPacketMapping");

/**
 windowTemplates is a map that stores the templates that will be populated during `npm run start`. At the root level,
 the key names can be arbitrarily chosen since the window title will be replaced by [template].title at runtime. Each
 template can contain a 'component' key-value pair such as 'component': 'fullscreen-column' which describes the
 container. These containers are mapped to the actual React component in componentMapping.js.
 If it contains a component key, it should also contain a 'shows' key-value pair that describes the children
 nodes that the container should render.

 > the component field can not use the object property of componentMapping like boardPacketMapping.receiveFields
 > because it is within the shared folder with Electron.
 */
const windowTemplates = {
  window1: {
    title: "Telemetry: Main",
    component: 'fullscreen-column',
    shows: {
      row1: [{ component: 'Navbar' }],
      row2: [{
        component: 'auto-grid', shows: {
          row1: [
            {
              component: 'Graph', shows: [
                receiveFields.pressurantPT
              ]
            },
            {
              component: 'Graph', shows: [
                receiveFields.loxTankPT
              ]
            },
            {
              component: 'Graph', shows: [
                receiveFields.fuelTankPT
              ]
            }
          ],
          row2: [
            {
              component: 'SixValueSquare', shows: [
                receiveFields.loxDomePT,
                receiveFields.loxExpectedStatic,
                receiveFields.pressurantTemp,
                receiveFields.fuelDomePT,
                receiveFields.fuelExpectedStatic,
                receiveFields.dPressurantPT,
                receiveFields.pressurantTemp
              ]
            },
            {
              component: 'Graph', shows: [
                receiveFields.loxInjectorPT
              ]
            },
            {
              component: 'Graph', shows: [
                receiveFields.fuelInjectorPT
              ]
            }
          ],
          row3: [
            { component: 'MessageDisplaySquare' },
            {
              component: 'Graph', shows: [
                receiveFields.loxTankBottomTC,
                receiveFields.loxTankMidTC,
                receiveFields.loxTankTopTC
              ]
            },
            {
              component: 'Graph', shows: [
                receiveFields.fuelTankBottomTC,
                receiveFields.fuelTankMidTC,
                receiveFields.fuelTankTopTC
              ]
            }
          ]
        }
      }]
    }
  },
}

module.exports = {
  windowTemplates
}
