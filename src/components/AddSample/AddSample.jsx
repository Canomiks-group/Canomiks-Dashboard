import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// material ui imports 
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, MenuItem, FormHelperText, FormControl, 
  Select, Typography, Grid } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import swal from 'sweetalert';


// material ui styling
const useStyles = makeStyles((theme) => ({
  inputs: {
   margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 180,
  },
}));


function AddSample() {
  // material ui
  const classes = useStyles();

  // set stuff so we can use them
  const dispatch = useDispatch();
  const history = useHistory();

  // get state from redux store
  const user = useSelector(store => store.user);
  const companyID = user.companyID;
  const currentSample = useSelector(store => store.orders.currentSample);
  const orderId = currentSample.id;

  // local states for input fields
  const [ingredientName, setName] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [format, setFormat] = useState('');
  const [ingredientAmount, setAmount] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [purity, setPurity] = useState('');
  const [dateManufactured, setDateManufactured] = useState('');
  const [extractionMethod, setMethod] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [sustainabilityInfo, setSustainability] = useState('');
  const [cropStrain, setCropStrain] = useState('');
  const [currentInput, setCurrentInput] = useState('');

  // functions
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("form submit")
  };

  // on shipping button click
  const shipping = () => {
    // if no value alert user
    if (
      !ingredientName ||
      !ingredientAmount ||
      !format ||
      !dateManufactured ||
      !lotNumber ||
      !extractionMethod
    ) {
      swal("Uh oh!", "Please fill out all required fields", "warning");

      return;
    }; // end required field check
    history.push('/shipping');
  
  }; // end shipping

  const cancel = (event) => {
    console.log(orderId, "orderId")
    swal({
      title: "Are you sure?",
      text: "Input fields will be cleared and order will be erased",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Your order has been cancelled", {
          icon: "success",
        });
        setName('');
        setLotNumber('');
        setFormat('');
        setPurity('');
        setDateManufactured('');
        setMethod('');
        setAmount('');
        setCity('');
        setState('');
        setCountry('');
        setCropStrain('');
        setHarvestDate('');
        setSustainability('');
        // clear the inputs

        dispatch({
          type: 'DELETE_CURRENT_SAMPLE',
          payload: {
            companyID,
            orderId
            // delete the current sample
          }
        });
      } else {
        swal("Your order is safe!");
      }
    });
    

   
 

  

  }; // end cancel

  function focusChange (val) {
    // make sure it has a value
  
    // send dispatch with the value
    dispatch({
      type: 'ADD_SAMPLE_INFO',
      payload: {
        name: currentInput,
        value: val,
        companyID,
        orderId
      }
    }); // end dispatch
  }; // end focusChange

  // text plugged into tooltips
  const nameText = `
  Pick an ingredient from this menu. If your ingredient is not listed, please use the 'other' option. For more detailed instructions, refer to the instruction manual.
  `;
  const lotText =`Please use the lot number you have created for this batch. For more detailed instructions, refer to the instruction manual.`;
  const formatText =`Select the proper ingredient format. For more detailed instructions, please refer to the instruction manual.`;
  const purityText = `Add percent purity of the active ingredient if known. For more detailed instructions, please refer to the instruction manual.`;
  const dateText = `Add the date that the ingredient was extracted or manufactured. For more detailed instructions, please refer to the instruction manual.`;
  const extractionText = `Add the extraction method such as ethanol, water etc. for the extraction of the ingredient. If no extraction method was used, please write the concentrator method for the ingredient. For more detailed instructions, please refer to the instruction manual.`;
  const regionText = `If known please add the region where the plant was grown. If ingredient was extracted from plants grown in more than one region, please write that in the blank space.`;
  const strainText =`If known please add the exact strain of the crop.`;
  const harvestDateText = `When was the plant harvested?`;
  const sustainabilityText = `Add information about sustainability such as fair trade, water conservation practices for the crop, sustainability certifications here.`;


  return (<>
    <div>
      <Grid container justify='center' alignItems='flex-start'>
        <FormControl variant="filled" className={classes.formControl}>
          <Select
            onFocus={() => setCurrentInput('ingredientName')}
            onBlur={() => focusChange(ingredientName)}
            value={ingredientName}
            required
            onChange={(e) => setName(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}>
            <MenuItem value="" disabled>
              Pick Ingredient
            </MenuItem>
            <MenuItem value={'CBD'}>CBD</MenuItem>
            <MenuItem value={'Other'}>Other</MenuItem>
          </Select>
          <FormHelperText>Ingredient Name</FormHelperText>
        </FormControl>
              {/* https://material-ui.com/components/tooltips/
              reference to tooltips */}
            <Tooltip title={nameText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
                {/* placement= popup display */}
                <InfoIcon />
            </Tooltip>
  
          <TextField
            onFocus={() => setCurrentInput('lotNumber')}
            onBlur={() => focusChange(lotNumber)}
            className={classes.inputs}
            required
            label='Lot Number'
            variant='filled'
            value={lotNumber} 
            type="text" 
            onChange={(event) => setLotNumber(event.target.value)}/>
          <Tooltip title={lotText}
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
            placement="top-end">
            <InfoIcon />
          </Tooltip>
          
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              onFocus={() => setCurrentInput('format')}
              onBlur={() => focusChange(format)}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}>
              <MenuItem value="" disabled>
                Pick a Format
              </MenuItem>
              <MenuItem value={'Powder'}>Powder</MenuItem>
              <MenuItem value={'Tincture'}>Tincture</MenuItem>
              <MenuItem value={'Oil'}>Oil</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
            </Select>
            <FormHelperText>Product Format</FormHelperText>
          </FormControl>

          <Tooltip title={formatText}
            TransitionComponent={Zoom} 
            TransitionProps={{ timeout: 600 }}
            placement="top-end">
            <InfoIcon />
          </Tooltip>     
      </Grid>

      <Grid container justify='center' alignItems='flex-start'>
         <TextField
          onFocus={() => setCurrentInput('ingredientAmount')}
          onBlur={() => focusChange(ingredientAmount)}
          className={classes.inputs}
          required
          label='Ingredient Amount'
          variant='filled'
          value={ingredientAmount} 
          type="text" 
          onChange={(event) => setAmount(event.target.value)}/>

          <FormControl variant="filled" className={classes.formControl}>
            <Select
              onFocus={() => setCurrentInput('ingredientUnit')}
              onBlur={() => focusChange(ingredientUnit)}
              value={ingredientUnit}
              onChange={(e) => setIngredientUnit(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}>

              <MenuItem value="" disabled>
                Pick a Unit
              </MenuItem>
              <MenuItem value={'Milligrams'}>Milligrams</MenuItem>
              <MenuItem value={'Grams'}>Grams</MenuItem>
              <MenuItem value={'Ounces'}>Ounces</MenuItem>
            </Select>
            <FormHelperText>Ingredient Unit</FormHelperText>
          </FormControl>
          <Tooltip title={formatText}
            TransitionComponent={Zoom} 
            TransitionProps={{ timeout: 600 }}
            placement="top-end">
            <InfoIcon />
          </Tooltip>

          <TextField
            onFocus={() => setCurrentInput('purity')}
            onBlur={() => focusChange(purity)}
            className={classes.inputs}
            label='Purity (if available)'
            variant='filled'
            value={purity} 
            type="text" 
            onChange={(event) => setPurity(event.target.value)}/>
            <Tooltip title={purityText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
                <InfoIcon />
            </Tooltip>
      </Grid>

      <Grid container justify='center' alignItems='flex-start'>
          <TextField
            onFocus={() => setCurrentInput('dateManufactured')}
            onBlur={() => focusChange(dateManufactured)}
            id="date"
            label="Date Manufactured"
            type="date"
            value={dateManufactured}
            defaultValue="2021-01-01"
            onChange={(e) => setDateManufactured(e.target.value)}
            className={classes.inputs}
            InputLabelProps={{
              shrink: true,
            }}/>

            <Tooltip title={dateText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
                <InfoIcon />
            </Tooltip>
          
          <TextField
            onFocus={() => setCurrentInput('extractionMethod')}
            onBlur={() => focusChange(extractionMethod)}
            className={classes.inputs}
            required
            label='Extraction Method'
            variant='filled'
            value={extractionMethod} 
            type="text" 
            onChange={(event) => setMethod(event.target.value)}/>
            <Tooltip title={extractionText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end" >
              <InfoIcon />
            </Tooltip>
            
            <TextField
            onFocus={() => setCurrentInput('cropStrain')}
            onBlur={() => focusChange(cropStrain)}
            className={classes.inputs}
            required
            label='Strain Of Crop'
            variant='filled'
            value={cropStrain} 
            type="text" 
            onChange={(event) => setCropStrain(event.target.value)}/>
            <Tooltip title={strainText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
              <InfoIcon />
            </Tooltip>        
      </Grid>

      <Grid container justify='center' alignItems='flex-start'>
          <Typography variant='body1'> 
            Growth Region: 
            <Tooltip title={regionText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
                <InfoIcon />
            </Tooltip>
          </Typography>

          <TextField
            onFocus={() => setCurrentInput('city')}
            onBlur={() => focusChange(city)}
            className={classes.inputs}
            required
            label='City'
            variant='filled'
            value={city} 
            type="text" 
            onChange={(event) => setCity(event.target.value)}/>
            
          <TextField
            onFocus={() => setCurrentInput('state')}
            onBlur={() => focusChange(state)}
            className={classes.inputs}
            required
            label='State'
            variant='filled'
            value={state} 
            type="text" 
            onChange={(event) => setState(event.target.value)}/>
              
          <TextField
            onFocus={() => setCurrentInput('country')}
            onBlur={() => focusChange(country)}
            className={classes.inputs}
            required
            label='Country'
            variant='filled'
            value={country} 
            type="text" 
            onChange={(event) => setCountry(event.target.value)}/>       
      </Grid>
        
      <Grid container justify='center' alignItems='flex-start'>
          <TextField
            onFocus={() => setCurrentInput('harvestDate')}
            onBlur={() => focusChange(harvestDate)}
            id="date"
            label="Harvest Date"
            value={harvestDate}
            type="date"
            defaultValue="2021-01-01"
            onChange={(e)=> setHarvestDate(e.target.value)}
            className={classes.inputs}
            InputLabelProps={{
              shrink: true,
            }}/>
            <Tooltip title={harvestDateText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
              <InfoIcon />
            </Tooltip>
       
          <TextField
            onFocus={() => setCurrentInput('sustainabilityInfo')}
            onBlur={() => focusChange(sustainabilityInfo)}
            className={classes.inputs}
            label='Sustainability Info:'
            variant='filled'
            value={sustainabilityInfo} 
            type="text" 
            onChange={(event) => setSustainability(event.target.value)}/>
            <Tooltip title={sustainabilityText}
              TransitionComponent={Zoom} 
              TransitionProps={{ timeout: 600 }}
              placement="top-end">
              <InfoIcon />
            </Tooltip>          
      </Grid>

      <Grid container justify='center' alignItems='flex-start'>
        <Button 
        className={classes.inputs}
        style={{ backgroundColor: "#1e565c", color: "white" }}
        variant='contained'
        onClick={shipping}>
          Shipping Info
        </Button>
        <Button 
        className={classes.inputs}
        style={{ backgroundColor: "#1e565c", color: "white" }}
        variant='contained'
        onClick={cancel}>
          Cancel Request
        </Button>
      </Grid>
      
    </div>
  </>)
}

export default AddSample;