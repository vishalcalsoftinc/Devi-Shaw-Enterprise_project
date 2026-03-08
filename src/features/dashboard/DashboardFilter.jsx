import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FilterBy from "../../ui/FilterBy";
import Modal from "../../ui/Modal";
import DateRangeSelector from "../../ui/DateRangeSelector";
import { getDashboardThisFilterOptions } from "./filterOptions";

const StyledFilterMenu = styled.div`
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  align-items: center;
`;

const HiddenTrigger = styled.button`
  display: none;
`;

function DashboardFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterByThis = searchParams.get("filterByThis") || "today";
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dashboardOptions = getDashboardThisFilterOptions();
  const customTriggerRef = useRef(null);

  useEffect(() => {
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");
  }, [searchParams]);

  function handleFilterChange(event) {
    const value = event.target.value;
    searchParams.set("filterByThis", value);
    searchParams.delete("filterByMonth");

    if (value !== "custom") {
      searchParams.delete("startDate");
      searchParams.delete("endDate");
    }

    searchParams.set("page", "1");
    setSearchParams(searchParams);

    if (value === "custom") {
      setTimeout(() => customTriggerRef.current?.click(), 0);
    }
  }

  function handleFilterClick() {
    if (filterByThis !== "custom") return;
    setTimeout(() => customTriggerRef.current?.click(), 0);
  }

  function handleApplyCustomRange() {
    if (!startDate || !endDate) return;
    searchParams.set("startDate", startDate);
    searchParams.set("endDate", endDate);
    searchParams.set("filterByThis", "custom");
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  function handleClearCustomRange() {
    searchParams.delete("startDate");
    searchParams.delete("endDate");
    setSearchParams(searchParams);
    setStartDate("");
    setEndDate("");
  }

  return (
    <StyledFilterMenu>
      <Modal>
        <FilterBy
          filterField="filterByThis"
          options={dashboardOptions}
          value={filterByThis}
          onChange={handleFilterChange}
          onClick={handleFilterClick}
        />
        <Modal.Open opens="customRange">
          <HiddenTrigger ref={customTriggerRef} type="button" aria-hidden>
            Open custom range
          </HiddenTrigger>
        </Modal.Open>
        <Modal.Window name="customRange">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApply={handleApplyCustomRange}
            onClear={handleClearCustomRange}
          />
        </Modal.Window>
      </Modal>
    </StyledFilterMenu>
  );
}

export default DashboardFilter;
