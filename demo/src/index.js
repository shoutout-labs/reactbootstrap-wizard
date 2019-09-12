import React, { useImperativeHandle, useState } from 'react'
import { render } from 'react-dom'

import ReactWizard from '../../src';
import './fonts/fontawesome/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Comp1 = ({setState,count}, ref) => {

  useImperativeHandle(ref, () => ({
    isValidated() {


      return true;
    },
    async onClickNext() {
     
    }
  }
  ))

  return <div ref={ref}>Component 1<br/>

  Count: {count}
  <button onClick={() => setState({count:count+1})}>Update count</button>
  </div>
}
const Comp2 = ({ }, ref) => {
  return <div ref={ref}>Component 2</div>
}
const Comp3 = ({ }, ref) => {
  return <div ref={ref}>Component 3</div>
}


const Demo = () => {
const [state,setState]=useState({count:0});

const steps = [
  {
    stepName: "Select Files",
    stepIcon: "fas fa-home",
    component: Comp1,
    stepProps: {
      formData: { test: "test" },
      count:state.count,
      setState
    }
  },
  {
    stepName: "Select Jobs",
    stepIcon: "fas fa-surprise",
    component: Comp2,
    // stepProps: {
    //     updateFormData,
    //     resetFormData,
    //     formData,
    //     toggleActiveLoader,

    //     setAlertData
    // }
  },
  {
    stepName: "Map Headers",
    stepIcon: "fas fa-swimmer",
    component: Comp3,
    // stepProps: {
    //     updateFormData,
    //     resetFormData,
    //     formData,
    //     toggleActiveLoader,
    //     setAlertData
    // }
  },
  {
    stepName: "Map Headers",
    stepIcon: "fas fa-swimmer",
    component: Comp1,
    // stepProps: {
    //     updateFormData,
    //     resetFormData,
    //     formData,
    //     toggleActiveLoader,
    //     setAlertData
    // }
  },

];

  return <div className="container">

    <ReactWizard
      color="success"
      steps={steps}
      navSteps={false}
      validate
      title="Upload Data"
      headerTextCenter
    
      // finishButtonClasses="btn-wd btn-info"
      // nextButtonClasses="btn-wd btn-info"
      // previousButtonClasses="btn-wd"

      finishButtonClick={(data) => {
        // setAlertData({ show: true, type: "success", title: "Success", body: 'The calculation job will run in the background, It may take a few minutes to complete this process, once complete upon approval of the admins this data will be merged into the existing customer data.', action: () => props.history.push("/") });
      }
      }
    />
  </div>

}

render(<Demo />, document.querySelector('#demo'))
