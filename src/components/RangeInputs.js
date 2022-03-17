const RangeInputs = ({ value, handleChange, name, min, max, step }) => {
  // const rangeInput = document.createElement("div");
  // const shadow = rangeInput.attachShadow({ mode: "open" });

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        name={name}
        list={`${name}-ticks`}
      />
    </>
  );
};

export default RangeInputs;
