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
* Removed wizard data since it is erroneous if click on previous button and had to set state. Use state in the root component and pass properties as required to the steps with stepProps (manage state in the root component)