import * as React from 'react';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Divider from '@mui/material/Divider';
import ListCheckbox from './ListCheckbox';

export interface Step {
  label: string,
  listItems: {
    id: string,
    name: string,
    selected: boolean,
    description?: string,
  }[]
}
interface StepData {
  steps: Step[],
  setSteps: React.Dispatch<React.SetStateAction<any[]>>
}

export default function StepperComponent(props: StepData) {
  const { steps, setSteps } = props;

  const [activeStep, setActiveStep] = React.useState(0);
  const [items, setItems] = React.useState(steps[activeStep].listItems);
  const [selectedItems, setSelectedItems] = React.useState(steps.map((step: Step) => {
    return {
      step: step.label,
      selectedItemsInStep: step.listItems.filter((listItem) => listItem.selected)
    }
  }));

  const maxSteps = steps.length;

  const handleSelectedItems = () => {
    const selectedItemsInSteps = steps.map((step: Step) => {
      const selectedItemsInStep = step.listItems.filter((listItem) => listItem.selected);
      return {
        step: step.label,
        selectedItemsInStep
      };
    }
    );

    setSelectedItems(selectedItemsInSteps);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setItems(steps[activeStep + 1].listItems);

    handleSelectedItems();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setItems(steps[activeStep - 1].listItems);

    handleSelectedItems();
  };

  const handleToggle = (id: string) => () => {
    const newListItems = items.map((listItem) => {
      if (listItem.id === id) {
        return { ...listItem, selected: !listItem.selected };
      }
      return listItem;
    });

    setItems(newListItems);
    setSteps((prevSteps: Step[]) => {
      const newSteps = prevSteps.map((step: Step) => {
        if (step.label === steps[activeStep].label) {
          return { ...step, listItems: newListItems };
        }
        return step;
      });
      return newSteps;
    });
  }

  console.log(selectedItems);
  

  return (
    <Box sx={{ flexGrow: 1, padding: '2rem' }} component={Paper} elevation={2} >
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
        }}
      >
        <Typography variant='h4' sx={{textAlign:'center',width:'100%'}}>{steps[activeStep].label}</Typography>
      </Paper>
      <Divider sx={{ marginTop: '1.5rem' }} />
      <Box sx={{ width: '100%', p: 2 }} >
        {(activeStep === maxSteps - 1) ? (
          <Typography>fim</Typography>
        ) : (
          <ListCheckbox listItems={items} handleToggle={handleToggle} />
        )}
      </Box>
      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ width: '50%', margin: 'auto' }}
        nextButton={
          <Button
            size="large"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            variant='contained'
          >
            Próximo
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="large" onClick={handleBack} disabled={activeStep === 0} variant='contained'>
            <KeyboardArrowLeft />
            Voltar
          </Button>
        }
      />
    </Box>
  );
}