import React, { useState, useEffect } from "react";
import "./scss/App.css";

function App() {
  const hideShow = (e) => {
    e.preventDefault();
    e.target.closest("ul").classList.toggle("hide");
  };

  const hideShowSection = (e) => {
    e.preventDefault();
    document.querySelector("#output").classList.toggle("hide-section");
  };

  const handleStateChange = (event) => {
    let inputValue;
    if (isNaN(event.target.value)) {
      inputValue = event.target.value;
    } else {
      inputValue = Number(event.target.value);
    }

    setCustomerInputs({
      ...customerInputs,
      [event.target.getAttribute("for")]: inputValue,
    });
  };

  const PMT = (ir, np, pv, fv, type) => {
    /*
     * ir   - Required. The interest rate for the loan.
     * np   - Required. The total number of payments for the loan.
     * pv   - Required. The present value, or the total amount that a series of future payments is worth now; also known as the principal.
     * fv   - Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
     * type - Optional. The number 0 (zero) or 1 and indicates when payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;
    fv || (fv = 0);
    type || (type = 0);
    if (ir === 0) return -(pv + fv) / np;
    pvif = Math.pow(1 + ir, np);
    pmt = (-ir * (pv * pvif + fv)) / (pvif - 1);
    if (type === 1) pmt /= 1 + ir;
    return pmt;
  };

  const averageWeeksPerMonth = Number(52 / 12).toFixed(2); // [HELPER] Average weeks per month (52/12)
  const [mowingMonthly, setMowingMonthly] = useState(108); // Converting mowing frequency to monthly
  const [lengthOffSeason, setLengthOffSeason] = useState(2.0); // [HELPER] Length of off-season (12 - lengthMowingSeason)
  const [customerInputs, setCustomerInputs] = useState({
    location: "OH", // Geography / location
    daysMowedPerWeek: 5, // Days mowed per week
    numberNGBRUnits: 5, // # Number of NGBR units
    mowingHours: 5, //    [HELPER] Mowing hours for calculation,
    lengthMowingSeason: 10, // Length of mowing season
  });
  const [requiredEquipment, setRequiredEquipment] = useState({
    bateries: 7,
    chargers: 2,
    totalBateries: 7,
    totalChargers: 2,
  });
  const powerProgramCosts = {
    battery: 1986,
    charger: 999,
  };
  const [pricing, setPricing] = useState(0);
  const dollarUSLocale = Intl.NumberFormat("en-US");
  const NGBRBatteryCapacity = 5;
  const latestAvgPowerPrice = 0.1004;
  const lastestMonth = "Oct 2021";
  const averageHourlyMaintenanceCost = 1.05;
  const PADDRegion = "PADD 2";
  const latestFuelWeeklyPrice = 3.108;
  const lastestWeek = "Jan 10, 2022";
  const fuelConsumptionRate = 1.7;
  const electricMaintenanceCostGas = 0.07;
  const [monthlyPaaSPowerCostNGBR, setMonthlyPaaSPowerCostNGBR] = useState(0);
  const [monthlyMaintenanceCostPerZTR, setMonthlyMaintenanceCostPerZTR] =
    useState(0);
  const [monthlyFuelCostPerZTR, setMonthlyFuelCostPerZTR] = useState(0);
  const [monthlyMaintenanceCostPerNGBR, setMonthlyMaintenanceCostPerNGBR] =
    useState(0);

  useEffect(() => {
    setMowingMonthly(
      Math.round(
        customerInputs.mowingHours *
          customerInputs.daysMowedPerWeek *
          averageWeeksPerMonth
      )
    );
    setLengthOffSeason(12 - customerInputs.lengthMowingSeason);
    setMonthlyPaaSPowerCostNGBR(
      Math.round(latestAvgPowerPrice * NGBRBatteryCapacity * mowingMonthly)
    );

    switch (customerInputs.mowingHours) {
      case 1:
        setRequiredEquipment({
          bateries: 5,
          chargers: 1,
          totalBateries: 5 * customerInputs.numberNGBRUnits,
          totalChargers: 1 * customerInputs.numberNGBRUnits,
        });
        break;
      case 3:
        setRequiredEquipment({
          bateries: 5,
          chargers: 1,
          totalBateries: 5 * customerInputs.numberNGBRUnits,
          totalChargers: 1 * customerInputs.numberNGBRUnits,
        });
        break;
      case 5:
        setRequiredEquipment({
          bateries: 7,
          chargers: 2,
          totalBateries: 7 * customerInputs.numberNGBRUnits,
          totalChargers: 2 * customerInputs.numberNGBRUnits,
        });
        break;
      case 7:
        setRequiredEquipment({
          bateries: 10,
          chargers: 2,
          totalBateries: 10 * customerInputs.numberNGBRUnits,
          totalChargers: 2 * customerInputs.numberNGBRUnits,
        });
        break;
      case 9:
        setRequiredEquipment({
          bateries: 12,
          chargers: 3,
          totalBateries: 12 * customerInputs.numberNGBRUnits,
          totalChargers: 3 * customerInputs.numberNGBRUnits,
        });
        break;
      default:
        setRequiredEquipment({
          bateries: 7,
          chargers: 2,
          totalBateries: 7 * customerInputs.numberNGBRUnits,
          totalChargers: 2 * customerInputs.numberNGBRUnits,
        });
        break;
    }

    setMonthlyMaintenanceCostPerZTR(
      Math.round(averageHourlyMaintenanceCost * mowingMonthly)
    );

    setMonthlyFuelCostPerZTR(
      Math.round(latestFuelWeeklyPrice * fuelConsumptionRate * mowingMonthly)
    );

    setMonthlyMaintenanceCostPerNGBR(
      Math.round(monthlyMaintenanceCostPerZTR * electricMaintenanceCostGas)
    );
  }, [
    customerInputs,
    averageWeeksPerMonth,
    mowingMonthly,
    monthlyMaintenanceCostPerZTR,
  ]);

  // useEffect(() => {}, [
  //   customerInputs.mowingHours,
  //   customerInputs.numberNGBRUnits,
  // ]);

  useEffect(() => {
    setPricing({
      totalCashPrice:
        requiredEquipment.totalBateries * powerProgramCosts.battery +
        requiredEquipment.totalChargers * powerProgramCosts.charger,
      priceMo36: Math.round(
        PMT(0.0399 / 12, 36, -pricing.totalCashPrice, 0, 0)
      ),
      priceMo48: Math.round(
        PMT(0.0499 / 12, 48, -pricing.totalCashPrice, 0, 0)
      ),
      targetPaasMonthlyPrice: pricing.priceMo48 + (pricing.priceMo48 * 0.1 + 1),
      annualRebateOffSeason: lengthOffSeason * pricing.targetPaasMonthlyPrice,
    });
  }, [
    requiredEquipment,
    powerProgramCosts.battery,
    powerProgramCosts.charger,
    pricing.totalCashPrice,
    pricing.priceMo48,
    pricing.targetPaasMonthlyPrice,
    lengthOffSeason,
  ]);

  return (
    <div className="App">
      <form>
        <ul>
          <li>
            <span>
              <label id="location">Which state do you operate in?</label>
            </span>
            <span>
              <select
                id="location"
                htmlFor="location"
                value={customerInputs.location}
                onChange={handleStateChange}
                placeholder="Select"
                disabled
              >
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </span>
          </li>
          <li>
            <span>
              <label id="daysMowedPerWeek">
                How many days do you mow per week?
              </label>
            </span>
            <span>
              <select
                htmlFor="daysMowedPerWeek"
                value={customerInputs.daysMowedPerWeek}
                onChange={handleStateChange}
                placeholder="Select"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
              </select>
            </span>
          </li>
          <li>
            <span>
              <label id="numberNGBRUnits">
                How many NGBRs do you plan to operate?
              </label>
            </span>
            <span>
              <select
                htmlFor="numberNGBRUnits"
                value={customerInputs.numberNGBRUnits}
                onChange={handleStateChange}
                placeholder="Select"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
            </span>
          </li>
          <li>
            <span>
              <label id="mowingHours">How many hours do you mow per day?</label>
            </span>
            <span>
              <select
                htmlFor="mowingHours"
                value={customerInputs.mowingHours}
                onChange={handleStateChange}
                placeholder="Select"
              >
                <option value="1">&#60;2</option>
                <option value="3">2-4</option>
                <option value="5">4-6</option>
                <option value="7">6-8</option>
                <option value="9">8+</option>
              </select>
            </span>
          </li>
          <li>
            <span>
              <label id="lengthMowingSeason">
                How long is your mowing season per year?
              </label>
            </span>
            <span>
              <select
                htmlFor="lengthMowingSeason"
                value={customerInputs.lengthMowingSeason}
                onChange={handleStateChange}
                placeholder="Select"
              >
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
            </span>
          </li>
        </ul>
        <ul>
          <li>
            <span>
              <label>Total number of batteries</label>
            </span>
            <span>
              <input id="" value={requiredEquipment.totalBateries} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Total number of chargers</label>
            </span>
            <span>
              <input id="" value={requiredEquipment.totalChargers} readOnly />
            </span>
          </li>
        </ul>
      </form>

      <button onClick={hideShowSection}>View main Fields</button>

      <form id="output" className="hide hide-section">
        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Converting mowing frequency to monthly</label>
            </span>
            <span>
              <input id="" value={mowingMonthly} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Length of off-season</label>
            </span>
            <span>
              <input id="" value={lengthOffSeason} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Number of batteries per NGBR</label>
            </span>
            <span>
              <input id="" value={requiredEquipment.bateries} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Number of chargers per NGBR</label>
            </span>
            <span>
              <input id="" value={requiredEquipment.chargers} readOnly />
            </span>
          </li>
        </ul>

        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Total number of batteries</label>
            </span>
            <span>
              <input id="" value={requiredEquipment.totalBateries} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Total number of chargers</label>
            </span>
            <span>
              <input id="" value={requiredEquipment.totalChargers} readOnly />
            </span>
          </li>
        </ul>

        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Total Cash Price</label>
            </span>
            <span>
              <input
                id=""
                value={"$" + dollarUSLocale.format(pricing.totalCashPrice)}
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Price/mo at 36 mos. 3.99%</label>
            </span>
            <span>
              <input
                id=""
                value={"$" + dollarUSLocale.format(pricing.priceMo36)}
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Price/mo at 48 mos. 4.99%</label>
            </span>
            <span>
              <input
                id=""
                value={"$" + dollarUSLocale.format(pricing.priceMo48)}
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Target PaaS Monthly Price</label>
            </span>
            <span>
              <input
                id=""
                value={
                  "$" + dollarUSLocale.format(pricing.targetPaasMonthlyPrice)
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Annualized PaaS Price</label>
            </span>
            <span>
              <input
                id=""
                value={
                  "$" +
                  dollarUSLocale.format(pricing.targetPaasMonthlyPrice * 12)
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Annual rebate from off-season</label>
            </span>
            <span>
              <input
                id=""
                value={
                  lengthOffSeason > 6
                    ? "-"
                    : "$" + dollarUSLocale.format(pricing.annualRebateOffSeason)
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Annualized PaaS Price (with off-season)</label>
            </span>
            <span>
              <input
                id=""
                value={
                  pricing.annualRebateOffSeason
                    ? "$" +
                      dollarUSLocale.format(
                        pricing.targetPaasMonthlyPrice * 12 -
                          pricing.annualRebateOffSeason
                      )
                    : "-"
                }
                readOnly
              />
            </span>
          </li>
        </ul>

        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Total monthly PaaS power cost</label>
            </span>
            <span>
              <input
                id=""
                value={
                  monthlyPaaSPowerCostNGBR * customerInputs.numberNGBRUnits
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Monthly PaaS power cost NGBR</label>
            </span>
            <span>
              <input id="" value={monthlyPaaSPowerCostNGBR} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Geography / location</label>
            </span>
            <span>
              <input id="" value={customerInputs.location} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Latest average monthly power price</label>
            </span>
            <span>
              <input id="" value={latestAvgPowerPrice} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>[HELPER] Latest month</label>
            </span>
            <span>
              <input id="" value={lastestMonth} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Power consumption rate per NGBR</label>
            </span>
            <span>
              <input id="" value={NGBRBatteryCapacity} readOnly />
            </span>
          </li>
        </ul>

        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Total monthly PaaS maintenance cost</label>
            </span>
            <span>
              <input
                id=""
                value={
                  monthlyMaintenanceCostPerNGBR * customerInputs.numberNGBRUnits
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Monthly maintenance cost per NGBR</label>
            </span>
            <span>
              <input id="" value={monthlyMaintenanceCostPerNGBR} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Electric maintenance cost as % of gas</label>
            </span>
            <span>
              <input id="" value={electricMaintenanceCostGas} readOnly />
            </span>
          </li>
        </ul>

        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Total monthly ZTR fuel cost</label>
            </span>
            <span>
              <input
                id="totalFuelCostZTR"
                value={
                  "$" +
                  dollarUSLocale.format(
                    monthlyFuelCostPerZTR * customerInputs.numberNGBRUnits
                  )
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Monthly fuel cost per ZTR</label>
            </span>
            <span>
              <input
                id="monthlyFuelCostPerZTR"
                value={"$" + dollarUSLocale.format(monthlyFuelCostPerZTR)}
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Geography / location</label>
            </span>
            <span>
              <input id="location" value={customerInputs.location} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>PADD region</label>
            </span>
            <span>
              <input id="PADDRegion" value={PADDRegion} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Latest fuel weekly price</label>
            </span>
            <span>
              <input
                id="latestFuelWeeklyPrice"
                value={latestFuelWeeklyPrice}
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label> [HELPER] Latest week</label>
            </span>
            <span>
              <input id="lastestWeek" value={lastestWeek} readOnly />
            </span>
          </li>
          <li>
            <span>
              <label>Fuel consumption rate</label>
            </span>
            <span>
              <input
                id="fuelConsumptionRate"
                value={fuelConsumptionRate}
                readOnly
              />
            </span>
          </li>
        </ul>

        <ul>
          <li className="button-hide">
            <button onClick={hideShow}>Hide</button>
          </li>
          <li>
            <span>
              <label>Total monthly ZTR maintenance cost</label>
            </span>
            <span>
              <input
                id="totalMonthlyZTRMaintenanceCost"
                value={
                  monthlyMaintenanceCostPerZTR * customerInputs.numberNGBRUnits
                }
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Monthly maintenance cost per ZTR</label>
            </span>
            <span>
              <input
                id="monthlyMaintenanceCostPerZTR"
                value={monthlyMaintenanceCostPerZTR}
                readOnly
              />
            </span>
          </li>
          <li>
            <span>
              <label>Average hourly maintenance cost</label>
            </span>
            <span>
              <input
                id="averageHourlyMaintenanceCost"
                value={averageHourlyMaintenanceCost}
                readOnly
              />
            </span>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default App;
