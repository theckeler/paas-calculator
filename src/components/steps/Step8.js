import React, { useState, useEffect } from "react";
import Inputs from "../inputs/Inputs";
import Outputs from "../outputs/Outputs";

const Step8 = ({
  customerInputs,
  whichStep,
  setDuoarea,
  setCustomerInputs,
  pricing,
  totalMonthlyPaaSPowerCost,
  totalMonthlyPaaSMaintenanceCost,
  requiredEquipment,
  breakeven,
  reductionFromNGBRResale,
  gasZTR,
  cashPurchase,
  NGBRWithFlexiblePowerProgram,
  numberOfMaintenanceJobsPerYear,
  averageTotalTimeForServicing,
  monthlyPaaSPowerCostNGBR,
  monthlyFuelCostPerZTR,
  monthlyMaintenanceCostPerNGBR,
  monthlyMaintenanceCostPerZTR,
  enviromentalBenefits,
  poundsOfCO2Avoided,
  editThis,
  setEditThis,
  latestAvgPowerPrice,
  setLatestAvgPowerPrice,
  latestFuelWeeklyPrice,
  setLatestFuelWeeklyPrice,
}) => {
  const [checkObserve, setCheckObserve] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCheckObserve(true);
        } else {
          setCheckObserve(false);
        }
      },
      {
        threshold: 1,
      }
    );
    if (document.querySelector("#paas-inputs-floating")) {
      observer.observe(document.querySelector("#paas-inputs-floating"));
    }
  }, [checkObserve]);
  return (
    <>
      <Inputs
        {...{
          setDuoarea,
          customerInputs,
          setCustomerInputs,
          whichStep,
          editThis,
          setEditThis,
          latestAvgPowerPrice,
          setLatestAvgPowerPrice,
          latestFuelWeeklyPrice,
          setLatestFuelWeeklyPrice,
          checkObserve,
        }}
      />

      <Outputs
        {...{
          pricing,
          totalMonthlyPaaSPowerCost,
          totalMonthlyPaaSMaintenanceCost,
          requiredEquipment,
          breakeven,
          reductionFromNGBRResale,
          gasZTR,
          cashPurchase,
          NGBRWithFlexiblePowerProgram,
          numberOfMaintenanceJobsPerYear,
          averageTotalTimeForServicing,
          monthlyPaaSPowerCostNGBR,
          customerInputs,
          monthlyFuelCostPerZTR,
          monthlyMaintenanceCostPerNGBR,
          monthlyMaintenanceCostPerZTR,
          enviromentalBenefits,
          poundsOfCO2Avoided,
          editThis,
          setEditThis,
        }}
      />
    </>
  );
};

export default Step8;
