# reactbootstrap-wizard

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Describe reactbootstrap-wizard here.

Based on https://github.com/creativetimofficial/react-bootstrap-wizard

## why

Original project is based on reactstrap. This is the react bootstrap version with little bit twekes and with progressbar only.

## notes

react-bootstrap does not include in the final package. Need to install it separately when using

## updates
* Component state will not automatically add to the wizard data (Since component state may have different data which does not required to be track in a global state)
* setWizardData function will receive as a property to the components and wizard data can be set using it.