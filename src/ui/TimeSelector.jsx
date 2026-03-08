import styled from "styled-components";

const TimeInput = styled.input`
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  color: inherit;
  font-family: inherit;
`;

const TimeRow = styled.label`
  display: grid;
  gap: 0.4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

function TimeSelector({
  label = "Time",
  value,
  onChange,
  disabled = false,
  showLabel = true,
}) {
  return (
    <TimeRow>
      {showLabel ? label : null}
      <TimeInput
        type="time"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={disabled}
        aria-label={showLabel ? undefined : label}
      />
    </TimeRow>
  );
}

export default TimeSelector;
