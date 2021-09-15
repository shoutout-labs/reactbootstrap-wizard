import React, { useRef } from "react";
import { Card, Nav, Tab, Button, ProgressBar } from "react-bootstrap";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./index.css";
let stepRefs = {};
const ReactWizard = (props) => {
  props.steps.forEach((step) => {
    if (!stepRefs[step.stepName]) {
      stepRefs[step.stepName] = useRef();
    }
  });

  return <Wizard {...props} stepRefs={stepRefs} />;
};

const StepProgress = ({
  steps,
  currentStep,
  highestStep,
  color,
  stepButtonClasses,
}) => {
  let progressValue = 0;
  switch (currentStep) {
    case 0: {
      progressValue = 0;
      break;
    }
    case steps.length - 1: {
      progressValue = 100;
      break;
    }

    default: {
      progressValue = (currentStep / (steps.length - 1)) * 100;
    }
  }
  return (
    <div>
      <div className="d-flex d-flex-row step-container align-items-center">
        {steps.map((prop, key) => {
          return (
            <React.Fragment>
              <div>
                <div className="d-flex d-flex-row step-progress align-items-center">
                  <Nav.Link
                    eventKey={key}
                    className={`d-inline rounded-circle ${
                      stepButtonClasses ? stepButtonClasses : ""
                    } ${
                      key === currentStep || key <= highestStep
                        ? " active text-white checked bg-" + color
                        : `text-${color} border-${color}`
                    }`}
                  >
                    {key === currentStep || key <= highestStep ? (
                      <span>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17.415' height='13.259' viewBox='0 0 17.415 13.259'%3E%3Cpath d='M10.641,18.889,6.485,14.733,5.1,16.118l5.541,5.541L22.515,9.785,21.13,8.4Z' transform='translate(-5.1 -8.4)' fill='%23fff'/%3E%3C/svg%3E" />
                      </span>
                    ) : prop.stepIcon !== undefined && prop.stepIcon !== "" ? (
                      <i className={prop.stepIcon} />
                    ) : (
                      <span>{key + 1}</span>
                    )}
                  </Nav.Link>
                  <div className="step-name">{prop.stepName}</div>
                </div>
              </div>
              {key < steps.length - 1 && (
                <div className="flex-fill ">
                  <div className="progress-container px-1">
                    <ProgressBar
                      now={key <= currentStep - 1 ? 100 : 0}
                      variant={color}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
class Wizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      highestStep: 0,
      color: this.props.color !== undefined ? this.props.color : "primary",
      nextButton: this.props.steps.length > 1 ? true : false,
      previousButton: false,
      finishButton: this.props.steps.length === 1 ? true : false,

      // movingTabStyle: {
      //     transition: "transform 0s"
      // }
    };

    this.navigationStepChange = this.navigationStepChange.bind(this);
    this.refreshAnimation = this.refreshAnimation.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.finishButtonClick = this.finishButtonClick.bind(this);
  }
  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener("resize", this.updateWidth.bind(this));
  }
  componentWillUnmount() {
    const ctx = this;
    //Reset components if wizard close
    this.props.steps.forEach((step) => {
      if (
        ctx.props.stepRefs[step.stepName] &&
        ctx.props.stepRefs[step.stepName].current.reset
      ) {
        ctx.props.stepRefs[step.stepName].current.reset();
      }
    });

    this.isCancelled = true;
    window.removeEventListener("resize", this.updateWidth);
    var id = window.setTimeout(null, 0);
    while (id--) {
      window.clearTimeout(id);
    }
  }
  updateWidth() {
    !this.isCancelled &&
      setTimeout(() => this.refreshAnimation(this.state.currentStep), 200);
  }
  navigationStepChange(key) {
    if (this.props.navSteps) {
      var validationState = true;
      if (this.props.validate && key > this.state.currentStep) {
        for (var i = this.state.currentStep; i < key; i++) {
          if (
            this.props.stepRefs[this.props.steps[i].stepName].current
              .isValidated !== undefined &&
            this.props.stepRefs[
              this.props.steps[i].stepName
            ].current.isValidated() === false
          ) {
            validationState = false;
            break;
          }
        }
      }
      if (validationState) {
        this.setState({
          currentStep: key,
          highestStep:
            key > this.state.highestStep ? key : this.state.highestStep,
          nextButton: this.props.steps.length > key + 1 ? true : false,
          previousButton: key > 0 ? true : false,
          finishButton: this.props.steps.length === key + 1 ? true : false,
        });
        this.refreshAnimation(key);
      }
    }
  }
  async nextButtonClick() {
    if (
      (this.props.validate &&
        ((this.props.stepRefs[this.props.steps[this.state.currentStep].stepName]
          .current.isValidated !== undefined &&
          this.props.stepRefs[
            this.props.steps[this.state.currentStep].stepName
          ].current.isValidated()) ||
          this.props.stepRefs[this.props.steps[this.state.currentStep].stepName]
            .current.isValidated === undefined)) ||
      this.props.validate === undefined ||
      !this.props.validate
    ) {
      try {
        if (
          this.props.stepRefs[this.props.steps[this.state.currentStep].stepName]
            .current.onClickNext
        ) {
          await this.props.stepRefs[
            this.props.steps[this.state.currentStep].stepName
          ].current.onClickNext();
        }
        let key = this.state.currentStep + 1;
        this.setState({
          currentStep: key,
          highestStep:
            key > this.state.highestStep ? key : this.state.highestStep,
          nextButton: this.props.steps.length > key + 1 ? true : false,
          previousButton: key > 0 ? true : false,
          finishButton: this.props.steps.length === key + 1 ? true : false,
        });
        this.refreshAnimation(key);
      } catch (e) {}
    }
  }
  previousButtonClick() {
    var key = this.state.currentStep - 1;
    if (key >= 0) {
      this.setState({
        currentStep: key,
        highestStep:
          key > this.state.highestStep ? key : this.state.highestStep,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false,
      });
      this.refreshAnimation(key);
    }
  }
  async finishButtonClick() {
    if (
      (this.props.validate === false &&
        this.props.finishButtonClick !== undefined) ||
      (this.props.validate &&
        ((this.props.stepRefs[this.props.steps[this.state.currentStep].stepName]
          .current.isValidated !== undefined &&
          this.props.stepRefs[
            this.props.steps[this.state.currentStep].stepName
          ].current.isValidated()) ||
          this.props.stepRefs[this.props.steps[this.state.currentStep].stepName]
            .current.isValidated === undefined) &&
        this.props.finishButtonClick !== undefined)
    ) {
      try {
        if (
          this.props.stepRefs[this.props.steps[this.state.currentStep].stepName]
            .current.onClickNext
        ) {
          await this.props.stepRefs[
            this.props.steps[this.state.currentStep].stepName
          ].current.onClickNext();
        }

        this.props.finishButtonClick();
      } catch (e) {}
    }
  }
  refreshAnimation(index) {
    var total = this.props.steps.length;
    var li_width = 100 / total;

    // var total_steps =
    //     this.props.steps !== undefined ? this.props.steps.length : 0;
    // var move_distance =
    //     this.refs.wizard !== undefined
    //         ? this.refs.navStepsLi.children[0].clientWidth / total_steps
    //         : 0;
    // var index_temp = index;
    var vertical_level = 0;

    var mobile_device = window.innerWidth < 600 && total > 3;

    if (mobile_device) {
      // move_distance = this.refs.navStepsLi.children[0].clientWidth / 2;
      index_temp = index % 2;
      li_width = 50;
    }

    this.setState({ width: li_width + "%" });

    // var step_width = move_distance;

    // move_distance = move_distance * index_temp;

    if (mobile_device) {
      vertical_level = parseInt(index / 2);
      vertical_level = vertical_level * 38;
    }

    // var movingTabStyle = {
    //     width: step_width,
    //     transform:
    //         "translate3d(" + move_distance + "px, " + vertical_level + "px, 0)",
    //     transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)"
    // };
    // this.setState({
    //     movingTabStyle: movingTabStyle
    // });
  }

  render() {
    return (
      <div className="wizard-container" ref="wizard">
        <div className="card-wizard active" variant={this.state.color}>
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="0"
            activeKey={this.state.currentStep}
            onSelect={(k) => this.navigationStepChange(k)}
          >
            <div
              className={
                this.props.headerTextCenter !== undefined ? "mx-5 text-center" : "mx-5"
              }
              data-background-color={this.state.color}
            >
              {this.props.title !== undefined ? (
                <Card.Title tag="h3">{this.props.title}</Card.Title>
              ) : null}
              {this.props.description !== undefined ? (
                <h3 className="description">{this.props.description}</h3>
              ) : null}

              <div className="wizard-navigation" ref="navStepsLi">
                <StepProgress
                  steps={this.props.steps}
                  currentStep={this.state.currentStep}
                  highestStep={this.state.highestStep}
                  color={this.props.color}
                  stepButtonClasses={this.props.stepButtonClasses}
                />
              </div>
            </div>

            <Tab.Content className="my-5">
              {this.props.steps.map((prop, key) => {
                const Component = React.forwardRef(prop.component);
                return (
                  <Tab.Pane
                    eventKey={key}
                    key={key}
                    className={classnames("fade", {
                      show: this.state.currentStep === key,
                    })}
                  >
                    {typeof prop.component === "function" ||
                    typeof prop.component === "object" ? (
                      <Component
                        ref={stepRefs[prop.stepName]}
                        {...prop.stepProps}
                      />
                    ) : (
                      <div ref={prop.stepName}>{prop.component}</div>
                    )}
                  </Tab.Pane>
                );
              })}
            </Tab.Content>

            <div style={{ float: "right" }}>
              {this.state.previousButton ? (
                <Button
                  className={classnames({
                    [this.props.previousButtonClasses]:
                      this.props.previousButtonClasses !== undefined,
                  })}
                  onClick={() => this.previousButtonClick()}
                  variant={`outline-${this.props.color}`}
                >
                  {this.props.previousButtonText !== undefined
                    ? this.props.previousButtonText
                    : "Previous"}
                </Button>
              ) : null}

              {this.state.nextButton ? (
                <Button
                  className={classnames("ml-3", {
                    [this.props.nextButtonClasses]:
                      this.props.nextButtonClasses !== undefined,
                  })}
                  onClick={() => this.nextButtonClick()}
                  variant={this.props.color}
                >
                  {this.props.nextButtonText !== undefined
                    ? this.props.nextButtonText
                    : "Next"}
                </Button>
              ) : null}
              {this.state.finishButton ? (
                <Button
                  className={classnames("ml-3", {
                    [this.props.finishButtonClasses]:
                      this.props.finishButtonClasses !== undefined,
                  })}
                  onClick={() => this.finishButtonClick()}
                  variant={this.props.color}
                >
                  {this.props.finishButtonText !== undefined
                    ? this.props.finishButtonText
                    : "Finish"}
                </Button>
              ) : null}
            </div>
            {/* <div style={{ float: "left" }}>
                {this.state.previousButton ? (
                  <Button
                    className={classnames("btn-previous rounded-0", {
                      [this.props.previousButtonClasses]:
                        this.props.previousButtonClasses !== undefined,
                    })}
                    onClick={() => this.previousButtonClick()}
                    variant="default"
                  >
                    {this.props.previousButtonText !== undefined
                      ? this.props.previousButtonText
                      : "Previous"}
                  </Button>
                ) : null}
              </div> */}
          </Tab.Container>
        </div>
      </div>
    );
  }
}

Wizard.defaultProps = {
  validate: false,
  previousButtonText: "Previous",
  finishButtonText: "Finish",
  nextButtonText: "Next",
  color: "primary",
  stepButtonClasses: "px-3 rounded",
};

ReactWizard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "warning",
    "danger",
    "success",
  ]),
  previousButtonClasses: PropTypes.string,
  finishButtonClasses: PropTypes.string,
  nextButtonClasses: PropTypes.string,
  stepButtonClasses: PropTypes.string,
  headerTextCenter: PropTypes.bool,
  navSteps: PropTypes.bool,
  validate: PropTypes.bool,
  finishButtonClick: PropTypes.func,
  previousButtonText: PropTypes.node,
  finishButtonText: PropTypes.node,
  nextButtonText: PropTypes.node,
  title: PropTypes.node,
  description: PropTypes.node,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      stepName: PropTypes.string.isRequired,
      stepIcon: PropTypes.string,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
        .isRequired,
      stepProps: PropTypes.object,
    })
  ).isRequired,
};

export default ReactWizard;
