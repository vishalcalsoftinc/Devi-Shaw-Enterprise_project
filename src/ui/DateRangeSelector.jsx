import styled from "styled-components";
import Button from "./Button";

const DateInput = styled.input`
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  color: inherit;
  font-family: inherit;
`;

const DateRangeForm = styled.div`
  display: grid;
  gap: 1.2rem;
`;

const DateRow = styled.label`
  display: grid;
  gap: 0.4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.6rem;
`;

function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
  onCloseModal,
  showEndDate = true,
  showActions = true,
  startLabel = "Start date",
  endLabel = "End date",
  disabled = false,
  showLabels = true,
}) {
  const canApply = Boolean(startDate && endDate);

  function handleApply() {
    if (!canApply) return;
    onApply?.();
    onCloseModal?.();
  }

  function handleClear() {
    onClear?.();
  }

  return (
    <div>
      <DateRangeForm>
        <DateRow>
          {showLabels ? startLabel : null}
          <DateInput
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange?.(event.target.value)}
            disabled={disabled}
            aria-label={showLabels ? undefined : startLabel}
          />
        </DateRow>
        {showEndDate && (
          <DateRow>
            {showLabels ? endLabel : null}
            <DateInput
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange?.(event.target.value)}
              disabled={disabled}
              aria-label={showLabels ? undefined : endLabel}
            />
          </DateRow>
        )}
      </DateRangeForm>
      {showActions && (
        <ModalActions>
          <Button variation="secondary" size="small" onClick={handleClear}>
            Clear
          </Button>
          <Button
            variation="primary"
            size="small"
            onClick={handleApply}
            disabled={!canApply}
          >
            Apply
          </Button>
        </ModalActions>
      )}
    </div>
  );
}

export default DateRangeSelector;
